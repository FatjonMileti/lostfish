import docusign, { EnvelopeDefinition, ProvisioningInformation } from 'docusign-esign';
const jwtConfig = require('./jwtConfig.json');
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import DocusignToken from '../../data/docusign.token';
import Envelope from './schemas/envelope';
import httpStatus from 'http-status';
import userService from '../User/user.service';
import createError from 'http-errors';
import { UserDocument } from '../User/user.interface';

const demoDocsPath = path.resolve(__dirname, './demo_documents');
const doc2File = 'World_Wide_Corp_Battle_Plan_Trafalgar.docx';
const doc3File = 'World_Wide_Corp_lorem.pdf';

const SCOPES = ['signature', 'impersonation'];

const getConsent = () => {
  const urlScopes = SCOPES.join('+');

  // Construct consent URL
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

const authenticateDocusign = async () => {
  const jwtLifeSec = 10 * 60; // requested lifetime for the JWT is 10 min
  const dsApi = new docusign.ApiClient();
  dsApi.setOAuthBasePath(jwtConfig.dsOauthServer.replace('https://', '')); // it should be domain only.
  const rsaKey = fs.readFileSync(jwtConfig.privateKeyLocation);

  try {
    const results = await dsApi.requestJWTUserToken(
      jwtConfig.dsJWTClientId,
      jwtConfig.impersonatedUserGuid,
      SCOPES,
      rsaKey,
      jwtLifeSec
    );
    const accessToken = results.body.access_token;

    // get user info
    const userInfoResults = await dsApi.getUserInfo(accessToken);

    // use the default account
    const userInfo = userInfoResults.accounts.find(
      (account: { isDefault: string }) => account.isDefault === 'true'
    );

    return {
      accessToken: results.body.access_token,
      apiAccountId: userInfo.accountId,
      basePath: `${userInfo.baseUri}/restapi`
    };
  } catch (e: any) {
    console.log(e);
    const body = e.response && e.response.body;
  }
};

const getArgs = ({
  apiAccountId,
  accessToken,
  basePath,
  details
}: {
  apiAccountId: string;
  accessToken: string;
  basePath: string;
  details: {
    signerEmail: string;
    signerName: string;
    ccEmail: string;
    ccName: string;
  };
}) => {
  const { signerEmail, signerName, ccEmail, ccName } = details;

  const envelopeArgs = {
    signerEmail,
    signerName,
    ccEmail,
    ccName,
    status: 'sent',
    doc2File: path.resolve(demoDocsPath, doc2File),
    doc3File: path.resolve(demoDocsPath, doc3File)
  };
  const args = {
    accessToken,
    basePath,
    accountId: apiAccountId,
    envelopeArgs
  };

  return args;
};

const getToken = async () => {
  const getLastToken = await DocusignToken.findOne().sort({ created_at: -1 });
  if (getLastToken && Date.now() < new Date(getLastToken.expires_in).getTime()) {
    console.log('re-using access_token ');
    return getLastToken.token;
  } else {
    console.log('generating a new access token');

    const dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(jwtConfig.basePath);
    const results = await dsApiClient.requestJWTUserToken(
      jwtConfig.dsJWTClientId,
      jwtConfig.impersonatedUserGuid,
      ['signature'],
      fs.readFileSync(path.join(__dirname, '../../tools/docusign/', 'private.key')),
      3600
    );

    const response = await DocusignToken.create({
      token: results.body.access_token,
      expires_in: Date.now() + (results.body.expires_in - 60) * 1000
    });

    return response.token;
  }
};

const getEnvelopesApi = async (request: Request) => {
  const dsApiClient = new docusign.ApiClient();
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
    roleName: 'Landlord'
  });

  // @ts-ignore
  const signer2 = docusign.TemplateRole.constructFromObject({
    email: tenant.email,
    name: `${tenant.first_name} ${tenant.last_name}`,
    tabs,
    clientUserId: tenant._id.toString(),
    roleName: 'Client'
  });

  env.templateRoles = [signer1, signer2];
  env.status = 'sent';

  return env;
};

const makeRecipientViewRequest = (name: string, email: string, userId: string) => {
  // @ts-ignore
  const viewRequest = new docusign.RecipientViewRequest();

  viewRequest.returnUrl = 'http://localhost:3000/api/docusign/success';
  viewRequest.authenticationMethod = 'none';
  viewRequest.email = email;
  viewRequest.userName = name;
  viewRequest.clientUserId = userId;

  return viewRequest;
};

const sendEnvelope = async (request: Request, response: Response) => {
  try {
    const envelopesApi = await getEnvelopesApi(request);

    // const landlord = await userService.findOne({ _id: response.locals.user_id });
    // const tenant = await userService.findOne({ _id: request.body.tenant });
    // if (!landlord || !tenant) {
    //   throw createError(httpStatus.NOT_FOUND).send({ message: 'User not found' });
    // }
    //
    // const envelope = makeEnvelope(landlord, tenant, request.body.company);
    //
    // const results = await envelopesApi.createEnvelope(jwtConfig.appAccountId, {
    //   envelopeDefinition: envelope
    // });
    //
    // if (results) {
    //   await Envelope.create({
    //     envelope_id: results.envelopeId,
    //     status: results.status,
    //     status_date_time: results.statusDateTime,
    //     uri: results.uri,
    //     land_lord: response.locals.user_id ?? '',
    //     tenant: request.body.tenant ?? '',
    //     created_by: response.locals.user_id ?? ''
    //   });
    // }
    //
    // if (results && results.envelopeId) {
    //   const viewRequestLandlord = makeRecipientViewRequest(
    //     `${landlord.first_name} ${landlord.last_name}`,
    //     landlord.email,
    //     landlord._id
    //   );
    //
    //   const viewRequestTenant = makeRecipientViewRequest(
    //     `${tenant.first_name} ${tenant.last_name}`,
    //     tenant.email,
    //     tenant._id
    //   );
    //
    //   const landlordResults = await envelopesApi.createRecipientView(
    //     jwtConfig.appAccountId,
    //     results.envelopeId,
    //     {
    //       recipientViewRequest: viewRequestLandlord
    //     }
    //   );
    //
    //   const tenantResults = await envelopesApi.createRecipientView(
    //     jwtConfig.appAccountId,
    //     results.envelopeId,
    //     {
    //       recipientViewRequest: viewRequestTenant
    //     }
    //   );
    //   const existingEnvelope = await Envelope.findOne({ envelope_id: results.envelopeId });
    //   if (!existingEnvelope) {
    //     throw createError(httpStatus.NOT_FOUND).send('Envelope not found');
    //   }
    //   if (existingEnvelope) {
    //     existingEnvelope.sign_url_landlord = landlordResults.url ?? '';
    //     existingEnvelope.sign_url_tenant = tenantResults.url ?? '';
    //   }
    //
    //   await existingEnvelope.save();
    //
    //   return response.send('ok');
    // }
    response.send('ok');
  } catch (error: any) {
    return response.status(httpStatus.BAD_REQUEST).send({ ...error?.response?.body });
  }
};

export default {
  getConsent,
  authenticateDocusign,
  getArgs,
  getToken,
  makeRecipientViewRequest,
  getEnvelopesApi,
  makeEnvelope,
  sendEnvelope
};
