import { Role, UserDocument } from '../../User/user.interface';
import docusign, {
  EnvelopeDefinition,
  EnvelopeDocumentsResult,
  EnvelopesApi,
  EnvelopesInformation,
  EnvelopeSummary,
  RecipientViewRequest,
  Tabs,
  TemplateRole,
  Text,
  ViewUrl
} from 'docusign-esign';
import config from '../../../config';
import { AssetDocument } from '../../Asset/asset.interface';
import moment from 'moment/moment';
import docusignLocalService from './docusign.local.service';
import { IEnvelope } from '../schemas/envelope';
import docusignService from './docusign.service';

const jwtConfig = config.docusign;

const makeRecipientViewRequest = ({
  user,
  envelopId
}: {
  user: UserDocument;
  envelopId: string;
}): RecipientViewRequest => {
  return {
    returnUrl: `${config.api_url}/api/docusign/success?userId=${user._id}&userType=${user.role}&envelopId=${envelopId}`,
    authenticationMethod: 'none',
    email: user.email,
    userName: `${user.first_name} ${user.last_name}`,
    clientUserId: user._id.toString()
  };
};

const createTransactionAgreementEnvelope = (user: UserDocument) => {
  // @ts-ignore
  const env: EnvelopeDefinition = new docusign.EnvelopeDefinition();
  env.templateId = jwtConfig.transactionAgreementTemplate;

  const signer1: TemplateRole = {
    email: user.email,
    name: `${user.first_name} ${user.last_name}`,
    clientUserId: user._id.toString(),
    roleName: 'User'
  };

  env.templateRoles = [signer1] as TemplateRole[];
  env.status = 'Sent';

  return env;
};

const createContractEnvelope = (
  landlord: UserDocument,
  tenant: UserDocument,
  property: AssetDocument
): EnvelopeDefinition => {
  // @ts-ignore
  const env: EnvelopeDefinition = new docusign.EnvelopeDefinition();

  env.templateId = jwtConfig.rentingTemplateId;

  const propertyAddress: Text = {
    tabLabel: 'property_address',
    value: property.asset_address.text ?? ''
  };

  const documentSendingDate: Text = {
    tabLabel: 'document_sending_date',
    value: moment().format('DD/MM/YYYY')
  };

  const nrOfMonths: Text = {
    tabLabel: 'nr_of_months',
    value: '12'
  };

  const startingFromDate: Text = {
    tabLabel: 'starting_from_date',
    value: moment().format('DD/MM/YYYY')
  };

  const rentingPrice: Text = {
    tabLabel: 'renting_price',
    value: property.asset_rent.rental_amount.toString()
  };

  const depositValue: Text = {
    tabLabel: 'deposit_value',
    value: property.asset_rent.deposit_amount.toString()
  };

  const tabsLandlord: Tabs = {
    textTabs: [propertyAddress, documentSendingDate, nrOfMonths, startingFromDate, rentingPrice, depositValue]
  };

  const signer1: TemplateRole = {
    email: landlord.email,
    name: `${landlord.first_name} ${landlord.last_name}`,
    tabs: tabsLandlord,
    clientUserId: landlord._id.toString(),
    roleName: Role.Landlord
  };

  const signer2: TemplateRole = {
    email: tenant.email,
    name: `${tenant.first_name} ${tenant.last_name}`,
    clientUserId: tenant._id.toString(),
    roleName: Role.Client
  };

  env.templateRoles = [signer1, signer2] as TemplateRole[];
  env.status = 'Sent';

  return env;
};

const createViewRequestForSigners = async ({
  landlord,
  tenant,
  envelopeId
}: IViewRequestSigners): Promise<{ viewRequestLandlord: any; viewRequestTenant: any }> => {
  const viewRequestLandlord: RecipientViewRequest = makeRecipientViewRequest({
    user: landlord,
    envelopId: envelopeId
  });

  const viewRequestTenant: RecipientViewRequest = makeRecipientViewRequest({
    user: tenant,
    envelopId: envelopeId
  });

  return {
    viewRequestLandlord,
    viewRequestTenant
  };
};

const createViewRequestForPrivacySigners = async ({
  user,
  envelopeId
}: IViewRequestLostfishPrivacySigners): Promise<{ viewRequestUser: any }> => {
  const viewRequestUser = makeRecipientViewRequest({
    user,
    envelopId: envelopeId
  });

  return {
    viewRequestUser
  };
};

const createViewRequestForUser = async ({
  user,
  envelopeId
}: IViewRequestLostfishPrivacySigners): Promise<{ viewRequestUser: any }> => {
  const viewRequestUser = makeRecipientViewRequest({
    user,
    envelopId: envelopeId
  });

  return {
    viewRequestUser
  };
};

const generateNewUrl = async ({
  envelope,
  user
}: {
  envelope: IEnvelope;
  user: UserDocument;
}): Promise<IEnvelope> => {
  const envelopesApi: EnvelopesApi = await docusignService.getEnvelopesApi();

  const { viewRequestUser } = await createViewRequestForUser({
    user,
    envelopeId: envelope.envelope_id
  });

  const userResults = await envelopesApi.createRecipientView(jwtConfig.appAccountId, envelope.envelope_id, {
    recipientViewRequest: viewRequestUser
  });

  if (user.role === Role.Landlord) {
    envelope.sign_url_landlord = userResults.url ?? '';
  } else if (user.role === Role.Client) {
    envelope.sign_url_tenant = userResults.url ?? '';
  }

  return envelope;
};

const createAndSaveEnvelopeSignUrl = async (
  landlord: UserDocument,
  tenant: UserDocument,
  results: EnvelopeSummary,
  envelopesApi: EnvelopesApi
): Promise<IEnvelope> => {
  const envelopeId = results.envelopeId as string;
  const { viewRequestLandlord, viewRequestTenant } = await createViewRequestForSigners({
    landlord,
    tenant,
    envelopeId
  });

  const landlordUrl = await createUserSignUrl({
    envelopeId,
    envelopesApi,
    viewRequest: viewRequestLandlord
  });

  const tenantUrl = await createUserSignUrl({
    envelopeId,
    envelopesApi,
    viewRequest: viewRequestTenant
  });

  return await docusignLocalService.setSignUrlForUsers(envelopeId, landlordUrl, tenantUrl);
};

const createUserSignUrl = async ({
  envelopeId,
  envelopesApi,
  viewRequest
}: {
  envelopeId: string;
  envelopesApi: EnvelopesApi;
  viewRequest: RecipientViewRequest;
}): Promise<string> => {
  const result: ViewUrl = await envelopesApi.createRecipientView(jwtConfig.appAccountId, envelopeId, {
    recipientViewRequest: viewRequest
  });

  return result.url ?? '';
};

const retrieveSignedDocuments = async (envelopeId: string) => {
  try {
    // Get the envelope documents from the DocuSign API
    const envelopesApi = await docusignService.getEnvelopesApi();
    const documentsResponse: EnvelopeDocumentsResult = await envelopesApi.listDocuments(
      jwtConfig.appAccountId,
      envelopeId
    );

    console.log('Signed document downloaded successfully.');
  } catch (error) {
    console.error('Error retrieving the signed document:', error);
  }
};

const fetchAllEnvelopes = async () => {
  try {
    const envelopesApi: EnvelopesApi = await docusignService.getEnvelopesApi();

    const options = {
      count: '100',
      fromDate: '2023-01-01',
      toDate: '2023-12-31'
    };

    const envelopesResponse: EnvelopesInformation = await envelopesApi.listStatusChanges(
      jwtConfig.appAccountId,
      options
    );
    return envelopesResponse.envelopes;
  } catch (error) {
    console.error('Error fetching envelopes:', error);
  }
};

export default {
  createUserSignUrl,
  generateNewUrl,
  createViewRequestForUser,
  makeRecipientViewRequest,
  createContractEnvelope,
  createViewRequestForSigners,
  createViewRequestForPrivacySigners,
  createAndSaveEnvelopeSignUrl,
  createTransactionAgreementEnvelope,
  //NOT USED FUNCTIONS
  retrieveSignedDocuments,
  fetchAllEnvelopes
};

interface IViewRequestSigners {
  landlord: UserDocument;
  tenant: UserDocument;
  envelopeId: string;
}

interface IViewRequestLostfishPrivacySigners {
  user: UserDocument;
  envelopeId: string;
}
