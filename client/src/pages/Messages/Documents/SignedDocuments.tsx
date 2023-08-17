import { Typography } from '../../../components/Typography';
import React, { HTMLAttributes } from 'react';
import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';
import config from '../../../config';
import { Checkbox, Grid } from '@mui/material';
import { Button } from '../../../components/Button';
import { Role } from '../../../utils/ability.util';
import { IRoom } from '../messages.interface';
import { styled } from '@mui/system';
import classNames from 'classnames';

const state: IGridState = {
  loading: true,
  rows: [],
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

interface SignedDocumentsProps extends HTMLAttributes<HTMLDivElement> {
  room: IRoom;
}

export const SignedDocuments = styled((props: SignedDocumentsProps) => {
  const { room } = props;
  const { auth, userDetails } = useUserStore();
  const [list, setList] = React.useState<IGridState>({
    ...state
  });

  React.useEffect(() => {
    getEnvelopes();
  }, []);

  const otherUser = room.participant._id === userDetails.user_id ? room.author : room.participant;

  const getEnvelopes = async () => {
    const { data } = await axios(auth.access_token).get(`${config.apiUrl}/api/docusign/envelope`, {
      params: {
        document_type: 'Rent Contract',
        property: room.property._id,
        participant: otherUser._id,
        getDataFor: userDetails.role
      }
    });
    setList((prevList: any) => ({
      ...prevList,
      rows: data.docs,
      totalRows: data.totalDocs,
      loading: false
    }));
  };

  const isLandlord = userDetails.role === Role.Landlord;

  const handleSign = async (item: any) => {
    const { data } = await axios(auth.access_token).get(`${config.apiUrl}/api/docusign/envelope/${item._id}`);
    window.location.href = isLandlord ? data.sign_url_landlord : data.sign_url_tenant;
  };

  return (
    <div className={classNames(props.className, 'signed-documents')}>
      <Typography variant='body3' className='signed-documents-title'>
        Sign documents
      </Typography>
      <div></div>

      {list.rows.length > 0 &&
        list.rows.map((item: any, index) => {
          return isLandlord ? (
            <SignedDocumentLandlord item={item} handleSign={handleSign} key={index} />
          ) : (
            <SignedDocumentTenant item={item} handleSign={handleSign} key={index} />
          );
        })}

      {list.rows.length === 0 && (
        <div className='modal-item'>
          <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>No signed documents</Typography>
          </Grid>
        </div>
      )}

      <div className='document-footer'>
        <Typography variant='body4'>
          You can find more information about why we need these documents in the Lostfish T&Cs section.
        </Typography>
      </div>
    </div>
  );
})`
  &.signed-documents {
    display: grid;
    row-gap: 24px;
    .signed-documents-title {
      font-family: At Gambit, serif;
    }
  }
`;

interface ISignedDocumentLandlord {
  item: any;
  handleSign: (item: any) => void;
}
const SignedDocumentLandlord = (props: ISignedDocumentLandlord) => {
  const { item, handleSign } = props;
  return (
    <div className='modal-item'>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid item>
          <Checkbox defaultChecked={!!item.signed_by_landlord} disabled />
          {item.document_type}
        </Grid>
        <Grid item style={{ display: 'flex' }}>
          <Button onClick={() => {}} style={{ marginRight: '5px' }}>
            View
          </Button>
          {!item.signed_by_landlord && <Button onClick={() => handleSign(item)}>Sign</Button>}
        </Grid>
      </Grid>
    </div>
  );
};

interface ISignedDocumentTenant {
  item: any;
  handleSign: (item: any) => void;
}
const SignedDocumentTenant = (props: ISignedDocumentTenant) => {
  const { item, handleSign } = props;
  return (
    <div className='modal-item'>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid item>
          <Checkbox defaultChecked={!!item.signed_by_tenant} disabled />
          {item.document_type}
        </Grid>
        <Grid item style={{ display: 'flex' }}>
          <Button onClick={() => {}} style={{ marginRight: '5px' }}>
            View
          </Button>
          {!item.signed_by_tenant && <Button onClick={() => handleSign(item)}>Sign</Button>}
        </Grid>
      </Grid>
    </div>
  );
};
