import docusign, {
  EnvelopeDefinition,
  ApiClient,
  EnvelopeSummary,
  ViewUrl,
  EnvelopesApi
} from 'docusign-esign';
import config from '../../../config';
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import DocusignToken from '../../../data/docusign.token';
import Envelope from '../schemas/envelope';
import httpStatus from 'http-status';
import userService from '../../User/user.service';
import createError from 'http-errors';
import { Role, UserDocument } from '../../User/user.interface';
import util from 'util';
import docusignLocalService from './docusign.local.service';
import assetService from '../../Property/services/property.service';
import moment from 'moment';
import envelopeService from './envelope.service';

const jwtConfig = config.docusign;

const SCOPES = ['signature', 'impersonation'];
const dsApiClient: ApiClient = new docusign.ApiClient();

const getConsent = () => {
  const urlScopes = SCOPES.join('+');
  const redirectUri = `${config.api_url}/api/docusign/callback`;
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
      fs.readFileSync(path.join(__dirname, '../', 'private.key')),
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
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + token);
  return new docusign.EnvelopesApi(dsApiClient);
};

const getTemplatesApi = async () => {
  const token = await getToken();
  dsApiClient.setBasePath(jwtConfig.basePath);
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + token);
  return new docusign.TemplatesApi(dsApiClient);
};

const makeTransactionAgreementEnvelope = (user: UserDocument) => {
  // @ts-ignore
  const env: EnvelopeDefinition = new docusign.EnvelopeDefinition();
  env.templateId = jwtConfig.transactionAgreementTemplate;

  // @ts-ignore
  const documentCreationDate = docusign.Text.constructFromObject({
    tabLabel: 'creation_date',
    value: moment().format('DD/MM/YYYY')
  });

  // @ts-ignore
  const userAddress = docusign.Text.constructFromObject({
    tabLabel: 'user_address',
    value: user.address ?? 'London, UK'
  });

  // @ts-ignore
  const tabsUser = docusign.Tabs.constructFromObject({
    textTabs: [documentCreationDate, userAddress]
  });

  // @ts-ignore
  const signer2 = docusign.TemplateRole.constructFromObject({
    email: user.email,
    name: `${user.first_name} ${user.last_name}`,
    clientUserId: user._id.toString(),
    tabs: tabsUser,
    roleName: 'User'
  });

  env.templateRoles = [signer2];
  env.status = 'Sent';

  return env;
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

  const { viewRequestLandlord, viewRequestTenant } = await envelopeService.createViewRequestForSigners({
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
    const tenantResults: ViewUrl = await envelopesApi.createRecipientView(
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
    const envelopesApi: EnvelopesApi = await getEnvelopesApi();

    const { viewRequestUser } = await envelopeService.createViewRequestForPrivacySigners({
      user,
      envelopeId: existingEnvelope.envelope_id
    });

    const userResults = await envelopesApi.createRecipientView(
      jwtConfig.appAccountId,
      existingEnvelope.envelope_id,
      {
        recipientViewRequest: viewRequestUser
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
  const { property_id } = request.body;
  try {
    const envelopesApi: EnvelopesApi = await getEnvelopesApi();

    const [landlord, tenantUser, property] = await Promise.all([
      userService.findOne({ _id: request.body.landlord }),
      userService.findOne({ _id: request.body.tenant }),
      assetService.findById(property_id)
    ]);

    if (!landlord || !tenantUser) {
      throw createError(httpStatus.NOT_FOUND, { message: 'User not found' });
    }

    if (!property) {
      throw createError(httpStatus.NOT_FOUND, { message: 'Property not found' });
    }

    const envelope: EnvelopeDefinition = envelopeService.createContractEnvelope(
      landlord,
      tenantUser,
      property
    );

    const results: EnvelopeSummary = await envelopesApi.createEnvelope(jwtConfig.appAccountId, {
      envelopeDefinition: envelope
    });

    if (results && results.envelopeId) {
      await docusignLocalService.createEnvelopeDoc(
        results,
        request.body.landlord,
        request.body.tenant,
        property_id
      );

      const existingEnvelope = await envelopeService.createAndSaveEnvelopeSignUrl(
        landlord,
        tenantUser,
        results,
        envelopesApi
      );

      return response.send(existingEnvelope);
    } else {
      response.status(httpStatus.BAD_REQUEST).send({ message: '' });
    }
  } catch (error: any) {
    console.log({ error });
    return response.status(httpStatus.BAD_REQUEST).send({ ...error?.response?.body });
  }
};

const createLostfishTransactionAgreement = async (request: Request, response: Response) => {
  try {
    const userId = response.locals.user_id as string;

    const user = await userService.findOne({ _id: userId });

    if (!user) {
      throw createError(httpStatus.NOT_FOUND, { message: 'user_not_found' });
    }
    const envelopesApi: EnvelopesApi = await getEnvelopesApi();

    const envelope: EnvelopeDefinition = envelopeService.createTransactionAgreementEnvelope(user);

    const results: EnvelopeSummary = await envelopesApi.createEnvelope(jwtConfig.appAccountId, {
      envelopeDefinition: envelope
    });

    if (results && results.envelopeId) {
      await docusignLocalService.createTransactionAgreementEnvelopeDoc(results, user._id, user.role);

      const { viewRequestUser } = await envelopeService.createViewRequestForUser({
        user,
        envelopeId: results.envelopeId
      });

      const userUrl = await envelopeService.createUserSignUrl({
        envelopeId: results.envelopeId,
        envelopesApi,
        viewRequest: viewRequestUser
      });

      const updatedEnvelope = await docusignLocalService.setSignUrlForAnyUser(
        results.envelopeId,
        userUrl,
        user.role
      );

      await userService.findAndUpdateUser(userId, {
        transaction_agreement_link: `${config.api_url}/api/docusign/envelope/${results.envelopeId}/download`
      });

      return response.send(updatedEnvelope);
    }

    throw createError(httpStatus.BAD_REQUEST, { message: 'transaction_generation_failed' });
  } catch (error: any) {
    console.log(error);
    return response.status(error.status || 400).send({ ...error });
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

export default {
  getConsent,
  getToken,
  getEnvelopesApi,
  createEnvelope,
  updateUrl,
  getSingleDocument,
  updateUrlForLoggedInUser,
  createLostfishTransactionAgreement
};
