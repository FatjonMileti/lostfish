import docusign, { EnvelopeDefinition, ErrorDetails } from 'docusign-esign';
import config from '../../../config';
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import DocusignToken from '../../../data/docusign.token';
import Envelope, { IEnvelope } from '../schemas/envelope';
import httpStatus from 'http-status';
import userService from '../../User/user.service';
import createError from 'http-errors';
import { Role, UserDocument } from '../../User/user.interface';
import util from 'util';
import docusignLocalService from './docusign.local.service';

const jwtConfig = config.docusign;

const SCOPES = ['signature', 'impersonation'];
const dsApiClient = new docusign.ApiClient();

interface IViewRequestSigners {
  landlord: UserDocument;
  tenant: UserDocument;
  envelopeId: string;
}

const createUserSignUrl = async ({
  envelopeId,
  envelopesApi,
  viewRequest
}: {
  envelopeId: string;
  envelopesApi: any;
  viewRequest: any;
}): Promise<string> => {
  const result = await envelopesApi.createRecipientView(jwtConfig.appAccountId, envelopeId, {
    recipientViewRequest: viewRequest
  });

  return result.url ?? '';
};

const createSingleRequestForLoggedInUser = async ({
  user,
  envelopeId
}: {
  user: UserDocument;
  envelopeId: string;
}): Promise<{ viewRequest: any }> => {
  const viewRequest = await makeRecipientViewRequest({
    user,
    envelopId: envelopeId
  });

  return {
    viewRequest
  };
};

const createViewRequestForSigners = async ({
  landlord,
  tenant,
  envelopeId
}: IViewRequestSigners): Promise<{ viewRequestLandlord: any; viewRequestTenant: any }> => {
  const viewRequestLandlord = await makeRecipientViewRequest({
    user: landlord,
    envelopId: envelopeId
  });

  const viewRequestTenant = await makeRecipientViewRequest({
    user: tenant,
    envelopId: envelopeId
  });

  return {
    viewRequestLandlord,
    viewRequestTenant
  };
};

const getConsent = () => {
  const urlScopes = SCOPES.join('+');

  // const redirectUri = 'https://developers.docusign.com/platform/auth/consent';
  const redirectUri = 'http://localhost:3000/api/docusign/callback';
  const consentUrl =
    `${jwtConfig.dsOauthServer}/oauth/auth?response_type=code&` +
    `scope=${urlScopes}&client_id=${jwtConfig.dsJWTClientId}&` +
    `redirect_uri=${redirectUri}`;

  console.log('Open the following URL in your browser to grant consent to the application:');
  console.log(consentUrl);
  return consentUrl;
};

const getToken = async () => {
  const getLastToken = await DocusignToken.findOne().sort({ created_at: -1 });
  if (getLastToken && Date.now() < new Date(getLastToken.expires_in).getTime()) {
    console.log('re-using access_token ');
    return getLastToken.token;
  } else {
    console.log('generating a new access token');

    dsApiClient.setBasePath(jwtConfig.basePath);
    const results = await dsApiClient.requestJWTUserToken(
      jwtConfig.dsJWTClientId,
      jwtConfig.impersonatedUserGuid,
      ['signature'],
      fs.readFileSync(path.join(__dirname, '../../../../', 'private.key')),
      3600
    );

    dsApiClient.addDefaultHeader('Authorization', `Bearer ${results.body.access_token}`);
    docusign.Configuration.default.setDefaultApiClient(dsApiClient);
    const response = await DocusignToken.create({
      token: results.body.access_token,
      expires_in: Date.now() + (results.body.expires_in - 60) * 1000
    });

    return response.token;
  }
};

const getEnvelopesApi = async () => {
  const token = await getToken();
  dsApiClient.setBasePath(jwtConfig.basePath);
  // @ts-ignore
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + token);
  return new docusign.EnvelopesApi(dsApiClient);
};

const makeEnvelope = (landlord: UserDocument, tenant: UserDocument, company: string) => {
  // @ts-ignore
  const env: EnvelopeDefinition = new docusign.EnvelopeDefinition();
  env.templateId = jwtConfig.templateId;
  // @ts-ignore
  const text = docusign.Text.constructFromObject({
    tabLabel: 'company_name',
    value: company
  });

  // Pull together the existing and new tabs in a Tabs object:
  // @ts-ignore
  const tabs = docusign.Tabs.constructFromObject({
    textTabs: [text]
  });

  // @ts-ignore
  const signer1 = docusign.TemplateRole.constructFromObject({
    email: landlord.email,
    name: `${landlord.first_name} ${landlord.last_name}`,
    tabs,
    clientUserId: landlord._id.toString(),
    roleName: Role.Landlord
  });

  // @ts-ignore
  const signer2 = docusign.TemplateRole.constructFromObject({
    email: tenant.email,
    name: `${tenant.first_name} ${tenant.last_name}`,
    tabs,
    clientUserId: tenant._id.toString(),
    roleName: Role.Client
  });

  env.templateRoles = [signer1, signer2];
  env.status = 'sent';

  return env;
};

const makeRecipientViewRequest = ({ user, envelopId }: { user: UserDocument; envelopId: string }) => {
  // @ts-ignore
  const viewRequest = new docusign.RecipientViewRequest();

  viewRequest.returnUrl = `${config.api_url}/api/docusign/success?userId=${user._id}&userType=${user.role}&envelopId=${envelopId}`;
  viewRequest.authenticationMethod = 'none';
  viewRequest.email = user.email;
  viewRequest.userName = `${user.first_name} ${user.last_name}`;
  viewRequest.clientUserId = user._id.toString();

  return viewRequest;
};

const updateUrl = async (request: Request, response: Response) => {
  const existingEnvelope = await Envelope.findOne({ _id: request.params.id });
  if (!existingEnvelope) {
    throw createError(httpStatus.NOT_FOUND, { message: 'Envelope not found' });
  }
  const landlord = await userService.findOne({ _id: response.locals.user_id });
  const tenant = await userService.findOne({ _id: existingEnvelope.tenant });
  if (!landlord || !tenant) {
    throw createError(httpStatus.NOT_FOUND, { message: 'User not found' });
  }

  const envelopesApi = await getEnvelopesApi();

  const { viewRequestLandlord, viewRequestTenant } = await createViewRequestForSigners({
    landlord,
    tenant,
    envelopeId: existingEnvelope.envelope_id
  });

  if (!existingEnvelope.signed_by_landlord) {
    const landlordResults = await envelopesApi.createRecipientView(
      jwtConfig.appAccountId,
      existingEnvelope.envelope_id,
      {
        recipientViewRequest: viewRequestLandlord
      }
    );
    existingEnvelope.sign_url_landlord = landlordResults.url ?? '';
  }
  if (!existingEnvelope.signed_by_tenant) {
    // @ts-ignore
    const tenantResults = await envelopesApi.createRecipientView(
      jwtConfig.appAccountId,
      existingEnvelope.envelope_id,
      {
        recipientViewRequest: viewRequestTenant
      }
    );

    existingEnvelope.sign_url_tenant = tenantResults.url ?? '';
  }

  await existingEnvelope.save();

  return existingEnvelope;
};

const generateNewUrlForLoggedInUser = async ({
  envelope,
  user
}: {
  envelope: IEnvelope;
  user: UserDocument;
}) => {
  const envelopesApi = await getEnvelopesApi();

  const { viewRequest } = await createSingleRequestForLoggedInUser({
    user,
    envelopeId: envelope.envelope_id
  });

  const userResults = await envelopesApi.createRecipientView(jwtConfig.appAccountId, envelope.envelope_id, {
    recipientViewRequest: viewRequest
  });

  if (user.role === Role.Landlord) {
    envelope.sign_url_landlord = userResults.url ?? '';
  } else if (user.role === Role.Client) {
    envelope.sign_url_tenant = userResults.url ?? '';
  }

  return envelope;
};

const updateUrlForLoggedInUser = async (request: Request, response: Response) => {
  const existingEnvelope = await Envelope.findOne({ _id: request.params.id });
  if (!existingEnvelope) {
    throw createError(httpStatus.NOT_FOUND, { message: 'Envelope not found' });
  }
  const user: UserDocument | null = await userService.findOne({ _id: response.locals.user_id });
  if (!user) {
    throw createError(httpStatus.NOT_FOUND, { message: 'User not found' });
  }

  try {
    const envelopesApi = await getEnvelopesApi();

    const { viewRequest } = await createSingleRequestForLoggedInUser({
      user,
      envelopeId: existingEnvelope.envelope_id
    });

    const userResults = await envelopesApi.createRecipientView(
      jwtConfig.appAccountId,
      existingEnvelope.envelope_id,
      {
        recipientViewRequest: viewRequest
      }
    );

    if (user.role === Role.Landlord) {
      existingEnvelope.sign_url_landlord = userResults.url ?? '';
    } else if (user.role === Role.Client) {
      existingEnvelope.sign_url_tenant = userResults.url ?? '';
    }

    await existingEnvelope.save();

    response.send(existingEnvelope);
  } catch (error: any) {
    response.status(httpStatus.BAD_REQUEST).send({ ...error });
  }
};

const createEnvelope = async (request: Request, response: Response) => {
  try {
    const envelopesApi = await getEnvelopesApi();

    const landlord = await userService.findOne({ _id: response.locals.user_id });
    const tenant = await userService.findOne({ _id: request.body.tenant });
    if (!landlord || !tenant) {
      throw createError(httpStatus.NOT_FOUND, { message: 'User not found' });
    }

    const envelope = makeEnvelope(landlord, tenant, 'Lostfish');

    const results = await envelopesApi.createEnvelope(jwtConfig.appAccountId, {
      envelopeDefinition: envelope
    });

    if (results) {
      await docusignLocalService.createEnvelopeDoc(results, response.locals.user_id, request.body.tenant);
    }

    if (results && results.envelopeId) {
      const { viewRequestLandlord, viewRequestTenant } = await createViewRequestForSigners({
        landlord,
        tenant,
        envelopeId: results.envelopeId
      });

      const landlordUrl = await createUserSignUrl({
        envelopeId: results.envelopeId,
        envelopesApi,
        viewRequest: viewRequestLandlord
      });

      const tenantUrl = await createUserSignUrl({
        envelopeId: results.envelopeId,
        envelopesApi,
        viewRequest: viewRequestTenant
      });

      const existingEnvelope = await docusignLocalService.setSignUrlForUsers(
        results.envelopeId,
        landlordUrl,
        tenantUrl
      );

      return response.send(existingEnvelope);
    } else {
      response.status(httpStatus.BAD_REQUEST).send({ message: '' });
    }
  } catch (error: any) {
    return response.status(httpStatus.BAD_REQUEST).send({ ...error?.response?.body });
  }
};

const retrieveSignedDocuments = async (envelopeId: string) => {
  try {
    // Get the envelope documents from the DocuSign API
    const envelopesApi = await getEnvelopesApi();
    const documentsResponse = await envelopesApi.listDocuments(jwtConfig.appAccountId, envelopeId);

    console.log({ documentsResponse: JSON.stringify(documentsResponse) });

    if (documentsResponse) {
      documentsResponse.envelopeDocuments
        ?.filter((item: any) => item.type === 'content')
        .forEach((doc: any) => {
          getSingleDocument(envelopeId, doc);
        });
    }

    // if(documentsResponse){
    //   // Download the signed document
    //   const documentId = documentsResponse?.envelopeDocuments[0].documentId; // Assuming there's only one document
    //   const documentResponse = await envelopesApi.getDocument(jwtConfig.appAccountId, envelopeId, documentId,{});
    //
    //   // Save the document to a file
    //   const filePath = '/envelopes/2a573eba-f8ba-4663-82d6-c33f9134e476'; // Update the file path as per your needs
    //   const fileStream = require('fs').createWriteStream(filePath);
    //   documentResponse.pipe(fileStream);
    // }

    console.log('Signed document downloaded successfully.');
  } catch (error) {
    console.error('Error retrieving the signed document:', error);
  }
};

const getSingleDocument = async (envelopeId: string, doc: any) => {
  const envelopesApi = await getEnvelopesApi();
  const results = await envelopesApi.getDocument(
    jwtConfig.appAccountId,
    envelopeId,
    doc.documentId ? doc.documentId : '1',
    {}
  );
  const documentStream = Buffer.from(results, 'binary');
  const filePath = `uploads/${doc.name}`; // Update the file path as per your needs
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(filePath, documentStream);
  return filePath;
};

const fetchAllEnvelopes = async () => {
  try {
    const envelopesApi = await getEnvelopesApi();

    // Set the criteria for fetching envelopes
    const options = {
      count: '100', // Maximum number of envelopes to retrieve in one call (adjust as needed)
      status: 'completed', // Optional: specify the status of the envelopes to filter,
      fromDate: '2023-01-01',
      toDate: '2023-12-31'
    };

    // Fetch the envelopes using the specified criteria
    const envelopesResponse = await envelopesApi.listStatusChanges(jwtConfig.appAccountId, options);

    // Retrieve the list of envelopes
    const envelopes = envelopesResponse.envelopes;

    if (envelopes) {
      // Process the retrieved envelopes
      envelopes.forEach((envelope) => {
        console.log(`Envelope ID: ${envelope.envelopeId}, Status: ${envelope.status}`);
        // Add your code to perform any necessary operations on each envelope
        console.log({ envelope });
      });

      console.log('Envelopes fetched successfully.');
    }
  } catch (error) {
    console.error('Error fetching envelopes:', error);
  }
};

//retrieveSignedDocuments('2a573eba-f8ba-4663-82d6-c33f9134e476');
//fetchAllEnvelopes();

export default {
  getConsent,
  getToken,
  makeRecipientViewRequest,
  getEnvelopesApi,
  makeEnvelope,
  createEnvelope,
  updateUrl,
  getSingleDocument,
  updateUrlForLoggedInUser,
  generateNewUrlForLoggedInUser
};

const test = {
  envelopeDocuments: [
    {
      authoritativeCopy: 'false',
      availableDocumentTypes: [{ isDefault: 'true', type: 'electronic' }],
      display: 'inline',
      documentId: '1',
      documentIdGuid: '0e5fb44f-4f7a-4bda-8d40-72e2560d2105',
      includeInDownload: 'true',
      name: 'Renting Document.pdf',
      order: '1',
      pages: [
        {
          dpi: '72',
          height: '792',
          pageId: '5a6497a1-1ed0-4d69-a6ca-88bf2e5c83d8',
          sequence: '1',
          width: '612'
        }
      ],
      signerMustAcknowledge: 'no_interaction',
      templateRequired: 'false',
      type: 'content',
      uri: '/envelopes/2a573eba-f8ba-4663-82d6-c33f9134e476/documents/1'
    },
    {
      authoritativeCopy: 'false',
      availableDocumentTypes: [{ isDefault: 'true', type: 'electronic' }],
      display: 'inline',
      documentId: 'certificate',
      documentIdGuid: 'ccfc49d6-9962-4ae0-a8be-6b40102dfe8e',
      includeInDownload: 'true',
      name: 'Summary',
      order: '999',
      signerMustAcknowledge: 'no_interaction',
      templateRequired: 'false',
      type: 'summary',
      uri: '/envelopes/2a573eba-f8ba-4663-82d6-c33f9134e476/documents/certificate'
    }
  ],
  envelopeId: '2a573eba-f8ba-4663-82d6-c33f9134e476'
};
