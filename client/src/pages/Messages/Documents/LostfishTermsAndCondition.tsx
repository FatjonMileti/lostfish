import { Typography } from '../../../components/Typography';
import React from 'react';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';
import config from '../../../config';
import { Checkbox, Grid } from '@mui/material';
import { Button } from '../../../components/Button';
import { Role } from '../../../utils/ability.util';
import { useProfileStore } from '../../../globalState/profile';
import { Link } from 'react-router-dom';

enum DocumentType {
  PRIVACY_AGREEMENT = 'Lostfish privacy agreement',
  TRANSACTION_AGREEMENT = 'Lostfish transaction agreement',
  RENT_CONTRACT = 'Rent Contract'
}

const state: IGridState = {
  loading: true,
  rows: [{ document_type: 'Lostfish privacy agreement', signed_by_landlord: false, signed_by_tenant: false }],
  totalRows: 0,
  rowsPerPageOptions: [10, 20, 50],
  pageSize: 9,
  page: 1,
  rowCount: 0,
  sort: 'created_at',
  asc: false,
  selectedIds: [],
  search: ''
};

export const LostfishTermsAndCondition = () => {
  const { auth, userDetails } = useUserStore();
  const [list, setList] = React.useState<IGridState>({
    ...state
  });

  React.useEffect(() => {
    getEnvelopes();
  }, []);

  const getEnvelopes = async () => {
    const { data } = await axios(auth.access_token).get(`${config.apiUrl}/api/docusign/envelope`, {
      params: {
        document_type: ['Lostfish transaction agreement']
      }
    });
    setList((prevList: any) => ({
      ...prevList,
      rows: [prevList.rows[0], ...data.docs],
      totalRows: data.totalDocs,
      loading: false
    }));
  };

  const handleSign = async (item: any) => {
    const { data } = await axios(auth.access_token).get(`${config.apiUrl}/api/docusign/envelope/${item._id}`);
    window.location.href = data.sign_url_tenant;
  };

  const handlePolicyAccept = async () => {
    try {
      const { data } = await axios(auth.access_token).patch(
        `${config.apiUrl}/api/user/${userDetails.user_id}`,
        {
          agreed_application_policy: true
        }
      );
    } catch (error: any) {}
  };

  return (
    <div className='modal-body'>
      <Typography variant='body3'>Lostfish T&Cs</Typography>
      <div></div>

      {list.rows.length > 0 &&
        list.rows.map((item: any, index) => {
          return item.document_type === DocumentType.PRIVACY_AGREEMENT ? (
            <SignedDocumentAgreementPolicy item={item} handleSign={handlePolicyAccept} />
          ) : (
            <SignedDocumentAgreement item={item} handleSign={handleSign} />
          );
        })}
      {list.rows.length === 0 && (
        <div className='modal-item'>
          <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Empty</Typography>
          </Grid>
        </div>
      )}
    </div>
  );
};

interface IAgreementDocument {
  item: any;
  handleSign: (item: any) => void;
}

const SignedDocumentAgreement = (props: IAgreementDocument) => {
  const { item, handleSign } = props;
  const { userDetails } = useUserStore();

  const isLandlord = userDetails.role === Role.Landlord;

  return (
    <div className='modal-item'>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid item>
          <Checkbox defaultChecked={isLandlord ? item.signed_by_landlord : item.signed_by_tenant} disabled />
          {item.document_type}
        </Grid>
        <Grid item style={{ display: 'flex' }}>
          {item.signed_by_tenant && (
            <a
              href={`${config.apiUrl}/api/docusign/envelope/${item.envelope_id}/download?fileName=${item.document_type}.pdf`}>
              Download
            </a>
          )}
          {isLandlord && !item.signed_by_landlord && <Button onClick={() => handleSign(item)}>Sign</Button>}
          {!isLandlord && !item.signed_by_tenant && <Button onClick={() => handleSign(item)}>Sign</Button>}
        </Grid>
      </Grid>
    </div>
  );
};

interface IAgreementPolicyDocument {
  item: any;
  handleSign: () => void;
}
const SignedDocumentAgreementPolicy = (props: IAgreementPolicyDocument) => {
  const { item, handleSign } = props;

  const user = useProfileStore();

  return (
    <div className='modal-item'>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid item style={{ marginTop: '10px' }}>
          {item.document_type}
        </Grid>
        <Grid item style={{ display: 'flex' }}>
          <Link style={{ marginTop: '10px' }} to='/policy-agreement'>
            Read policy agreement
          </Link>
          <Checkbox
            defaultChecked={user.agreed_application_policy}
            onClick={handleSign}
            disabled={user.agreed_application_policy}
          />
        </Grid>
      </Grid>
    </div>
  );
};
