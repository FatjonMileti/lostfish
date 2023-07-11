import docusign, { ProvisioningInformation } from 'docusign-esign';
const jwtConfig = require('./jwtConfig.json');
import fs from 'fs';
import path from 'path';

const demoDocsPath = path.resolve(__dirname, './demo_documents');
const doc2File = 'World_Wide_Corp_Battle_Plan_Trafalgar.docx';
const doc3File = 'World_Wide_Corp_lorem.pdf';

const SCOPES = ['signature', 'impersonation'];

const getConsent = () => {
  const urlScopes = SCOPES.join('+');

  // Construct consent URL
  const redirectUri = 'https://developers.docusign.com/platform/auth/consent';
  const consentUrl =
    `${jwtConfig.dsOauthServer}/oauth/auth?response_type=code&` +
    `scope=${urlScopes}&client_id=${jwtConfig.dsJWTClientId}&` +
    `redirect_uri=${redirectUri}`;

  console.log('Open the following URL in your browser to grant consent to the application:');
  console.log(consentUrl);
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

export default { getConsent, authenticateDocusign, getArgs };
