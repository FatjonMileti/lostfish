import React from 'react';
import { useUserStore } from '../../../globalState/user';
import { useDocuments } from './useDocuments.hook';
import { Typography } from '../../../components/Typography';
import { DOCUMENT_TYPES } from '../../MyAccount/user.interface';
import { Checkbox, Grid, Paper } from '@mui/material';
import { UploadComponent } from './UploadComponent';
import { Button } from '../../../components/Button';
import { IRoom } from '../messages.interface';

interface ITenantProps {
  room: IRoom;
}
export const TenantDocuments = (props: ITenantProps) => {
  const { room } = props;
  const { auth, userDetails } = useUserStore();
  const [selectedFile, setSelectedFile] = React.useState<any>(null);
  const participant = userDetails.user_id === room.participant._id ? room.author._id : room.participant._id;

  const { documents, setDocument, userDocuments, useMyDocument, handleDocument } = useDocuments({
    participant
  });

  return (
    <div className='modal-body'>
      <Typography variant='body3'>Tenant documents</Typography>
      <div></div>

      {DOCUMENT_TYPES.map((document, index) => {
        const userDocument = userDocuments.find((userDoc) => userDoc.type === document.type);
        const selectedDocument = documents.find((userDoc) => userDoc.type === document.type);

        return (
          <Paper elevation={3} style={{ padding: 10, border: '1px solid #ccc' }} key={index}>
            <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid item>
                <Checkbox checked={Boolean(!!selectedDocument?.key)} disabled />
                {document.type}
              </Grid>
              <Grid item style={{ display: 'flex' }}>
                {selectedDocument?.key ? (
                  <div>
                    {selectedFile && selectedFile.key === selectedDocument.key ? (
                      <div>
                        <UploadComponent
                          handleDocument={(file: any) => handleDocument(file, document.type)}
                        />
                        {userDocument && (
                          <Button onClick={() => useMyDocument(userDocument)}>Use my {document.type}</Button>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex' }}>
                        {selectedDocument.mimetype.startsWith('image') && (
                          <img
                            src={selectedDocument.link}
                            width={40}
                            height={40}
                            style={{ marginRight: '10px', marginTop: '5px' }}
                            alt={''}
                          />
                        )}
                        {selectedDocument.mimetype.startsWith('application/pdf') && (
                          <>
                            <a
                              href={`${selectedDocument.link}?fileName=${selectedDocument.originalname}`}
                              target='_blank'>
                              {selectedDocument.originalname})
                            </a>
                          </>
                        )}
                        <Button sx={{ marginRight: '5px' }} onClick={() => setSelectedFile(selectedDocument)}>
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
            </Grid>
          </Paper>
        );
      })}
    </div>
  );
};
