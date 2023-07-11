import { Router, Request } from 'express';
import docusignService from './docusign.service';
const router: Router = Router();
import docusign, { ProvisioningInformation, EnvelopeDefinition } from 'docusign-esign';
const jwtConfig = require('./jwtConfig.json');
import fs from 'fs';
import path from 'path';

router.post('/form', async (request, response) => {
  await checkToken(request);
  const envelopesApi = getEnvelopesApi(request);
  const envelope = makeEnvelope(request.body.name, request.body.email, request.body.company);

  const results = await envelopesApi.createEnvelope(jwtConfig.dsJWTClientId, {
    envelopeDefinition: envelope
  });
  if (results) {
    console.log('envelope results ', results);
    // Create the recipient view, the Signing Ceremony
    const viewRequest = makeRecipientViewRequest(request.body.name, request.body.email);
    if (results.envelopeId != null) {
      const newresults = await envelopesApi.createRecipientView(jwtConfig.dsJWTClientId, results.envelopeId, {
        recipientViewRequest: viewRequest
      });
      if (newresults.url != null) {
        response.redirect(newresults.url);
      }
    }
  }
});

function getEnvelopesApi(request: Request) {
  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(jwtConfig.basePath);
  // @ts-ignore
  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + request.session.access_token);
  return new docusign.EnvelopesApi(dsApiClient);
}

function makeEnvelope(name: string, email: string, company: string) {
  const env: EnvelopeDefinition = new docusign.EnvelopeDefinition();
  env.templateId = jwtConfig.templateId;
  const text = docusign.Text.constructFromObject({
    tabLabel: 'company_name',
    value: company
  });

  // Pull together the existing and new tabs in a Tabs object:
  const tabs = docusign.Tabs.constructFromObject({
    textTabs: [text]
  });

  const signer1 = docusign.TemplateRole.constructFromObject({
    email,
    name,
    tabs,
    clientUserId: 10000,
    roleName: 'Applicant'
  });

  env.templateRoles = [signer1];
  env.status = 'sent';

  return env;
}

function makeRecipientViewRequest(name: string, email: string) {
  const viewRequest = new docusign.RecipientViewRequest();

  viewRequest.returnUrl = 'http://localhost:3000/api/docusign/success';
  viewRequest.authenticationMethod = 'none';

  // Recipient information must match embedded recipient info
  // we used to create the envelope.
  viewRequest.email = email;
  viewRequest.userName = name;
  viewRequest.clientUserId = process.env.CLIENT_USER_ID;

  return viewRequest;
}

async function checkToken(request: Request) {
  // @ts-ignore
  if (request.session.access_token && Date.now() < request.session.expires_at) {
    console.log('re-using access_token ', request.session.access_token);
  } else {
    console.log('generating a new access token');
    const dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(jwtConfig.basePath);
    const results = await dsApiClient.requestJWTUserToken(
      jwtConfig.dsJWTClientId,
      jwtConfig.impersonatedUserGuid,
      'signature',
      fs.readFileSync(path.join(__dirname, 'private.key')),
      3600
    );
    console.log(results.body);
    request.session.access_token = results.body.access_token;
    request.session.expires_at = Date.now() + (results.body.expires_in - 60) * 1000;
  }
}

router.get('/', async (request, response) => {
  await checkToken(request);
  response.sendFile(path.join(__dirname, 'main.html'));
});

router.get('/success', (request, resposne) => {
  resposne.send('Success');
});
