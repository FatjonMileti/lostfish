import React from 'react';
import { useUserStore } from '../../../globalState/user';
import { useDocuments } from './useDocuments.hook';
import { Typography } from '../../../components/Typography';
import { Checkbox, Grid, Paper } from '@mui/material';
import { UploadComponent } from './UploadComponent';
import { Button } from '../../../components/Button';
import { IRoom } from '../messages.interface';
import { useAbility } from '@casl/react';
import { AbilityContext } from '../../../context/AbilityContext';
import { CASLAction } from '../../../utils/ability.util';
import { DocumentType, IUser_Documents } from '../../MyAccount/user.interface';

interface ITenantProps {
  room: IRoom;
}
export const TenantDocuments = (props: ITenantProps) => {
  const { room } = props;
  const { userDetails } = useUserStore();
  const [selectedFile, setSelectedFile] = React.useState<any>(null);
  const participant = userDetails.user_id === room.participant._id ? room.author._id : room.participant._id;

  const { documents, userDocuments, approveOrDisapproveDocument, useMyDocument, handleDocument } =
    useDocuments({
      participant
    });

  const ability = useAbility(AbilityContext);

  const canManageDocs = ability.can(CASLAction.Manage, 'Documents');
  const canApproveDocuments = ability.can(CASLAction.Update, 'Documents', 'file.approved');

  return (
    <div className='modal-body'>
      <Typography variant='body3'>Tenant documents</Typography>
      <div></div>

      {documents.map((document, index) => {
        const userDocument = userDocuments.find((userDoc) => userDoc.type === document.type);

        return (
          <div className='modal-item' key={index}>
            <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid item>
                <Checkbox checked={Boolean(!!document?.key)} disabled />
                {document.type}
              </Grid>
              {canManageDocs && (
                <TenantDocumentItem
                  document={document}
                  userDocument={userDocument}
                  key={index}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  useMyDocument={useMyDocument}
                  handleDocument={handleDocument}
                />
              )}
              {canApproveDocuments && (
                <LandlordDocumentItem
                  document={document}
                  approveOrDisapproveDocument={approveOrDisapproveDocument}
                />
              )}
            </Grid>
          </div>
        );
      })}
    </div>
  );
};

interface ITenantDocumentItem {
  document: IUser_Documents;
  selectedFile: any;
  setSelectedFile: React.Dispatch<React.SetStateAction<any>>;
  userDocument: IUser_Documents | undefined;
  useMyDocument: (document: IUser_Documents) => void;
  handleDocument: (document: IUser_Documents, type: DocumentType) => void;
}

const TenantDocumentItem = ({
  document,
  selectedFile,
  userDocument,
  setSelectedFile,
  useMyDocument,
  handleDocument
}: ITenantDocumentItem) => {
  return (
    <Grid item style={{ display: 'flex' }}>
      {document?.key ? (
        <div>
          {selectedFile && selectedFile.key === document.key ? (
            <div>
              <UploadComponent handleDocument={(file: any) => handleDocument(file, document.type)} />
              {userDocument && (
                <Button onClick={() => useMyDocument(userDocument)}>Use my {document.type}</Button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              {document.mimetype.startsWith('image') && (
                <img
                  src={document.link}
                  width={40}
                  height={40}
                  style={{ marginRight: '10px', marginTop: '5px' }}
                  alt={''}
                />
              )}
              {document.mimetype.startsWith('application/pdf') && (
                <>
                  <a href={`${document.link}?fileName=${document.originalname}`} target='_blank'>
                    {document.originalname})
                  </a>
                </>
              )}
              <Button sx={{ marginRight: '5px' }} onClick={() => setSelectedFile(document)}>
                Edit
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <UploadComponent handleDocument={(file: any) => handleDocument(file, document.type)} />
          {userDocument && (
            <Button onClick={() => useMyDocument(userDocument)}>Use my {document.type}</Button>
          )}
        </div>
      )}
    </Grid>
  );
};

interface ILandlordDocumentItem {
  document: IUser_Documents;
  approveOrDisapproveDocument: (document: IUser_Documents) => void;
}
const LandlordDocumentItem = ({ document, approveOrDisapproveDocument }: ILandlordDocumentItem) => {
  return (
    <Grid item style={{ display: 'flex' }}>
      {document?.approved ? (
        'Approved'
      ) : (
        <>
          {document.key ? (
            <Button sx={{ marginRight: '5px' }} onClick={() => approveOrDisapproveDocument(document)}>
              Approve
            </Button>
          ) : (
            <p>No document uploaded by tenant</p>
          )}
        </>
      )}
    </Grid>
  );
};
