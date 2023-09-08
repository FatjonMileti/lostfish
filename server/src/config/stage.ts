import * as process from 'process';
require('dotenv').config();

export default {
  port: process.env.PORT || 3000,
  uses3Bucket: process.env.USE_S3_BACKET === 'true' || false,
  behind_proxy: process.env.BEHIND_PROXY || 1,
  useAzureStorage: process.env.USE_AZURE_BLOB_BACKET === 'true',
  azure: {
    storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    azureStorageName: process.env.AZURE_STORAGE_NAME
  },
  mongo: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    protocol: process.env.DB_PROTOCOL,
    port: process.env.DB_PORT
  },
  docusign: {
    dsJWTClientId: process.env.DS_JWT_CLIENT_ID ?? '',
    appAccountId: process.env.APP_ACCOUNT_ID ?? '',
    impersonatedUserGuid: process.env.IMPERSONATED_USER_GUID ?? '',
    dsOauthServer: process.env.DS_OAUTH_SERVER ?? '',
    rentingTemplateId: process.env.RENTING_TEMPLATE_ID ?? '',
    transactionAgreementTemplate: process.env.LOSTFISH_TRANSACTION_AGREEMENT_TEMPLATE_ID ?? '',
    privacyAgreementTemplate: process.env.LOSTFISH_PRIVACY_AGREEMENT_TEMPLATE_ID ?? '',
    basePath: process.env.DOCUSIGN_BASE_PATH ?? ''
  },
  connectionString: `${process.env.DB_PROTOCOL}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
  imageGeneratorKey: process.env.IMAGE_GENERATOR_KEY,
  imageGeneratorSecret: process.env.IMAGE_GENERATOR_SECRET,
  logging: true
};
