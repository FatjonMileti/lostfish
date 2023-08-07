import React from 'react';
import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import axios from '../../utils/axios';
import { DOCUMENT_TYPES, DocumentType, IUser_Documents } from './user.interface';
import { useUserStore } from '../../globalState/user';
import { useProfileStore } from '../../globalState/profile';
import { Backdrop } from '../../components/Backdrop';
import { DocumentsView } from './components/DocumentsView';

export const TransactionAgreement = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = React.useState<IUser_Documents[]>([]);

  const [loading, setLoading] = React.useState(false);

  const { userDetails, auth } = useUserStore();
  const profileStore = useProfileStore();

  React.useEffect(() => {
    getDocuments();
  }, [profileStore]);

  const getDocuments = () => {
    const { documents } = profileStore;
    if (documents?.length > 0) {
      setDocuments(
        DOCUMENT_TYPES.map((doc) => {
          const exitingDocument = documents.find((item) => item.type === doc.type && item.key && item.link);
          return exitingDocument ? exitingDocument : doc;
        })
      );
    }
  };

  const handleAddDocumentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    try {
      setLoading(true);

      const selectedFile = event.target.files && event.target.files[0];
      if (selectedFile) {
        // Handle the selected file
        const formData = new FormData();

        formData.append('images', selectedFile);
        const response = await axios(auth.access_token).post('/api/upload/private-docs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          const documentsToSend: IUser_Documents[] = DOCUMENT_TYPES.map((doc) => {
            if (doc.type === type) {
              doc.key = response.data[0].key;
              doc.mimetype = response.data[0].mimetype;
              doc.originalname = response.data[0].originalname;
              return doc;
            } else {
              return doc;
            }
          });

          await updateUserDocs(documentsToSend);
          await profileStore.fetchProfile(auth.access_token);
        }
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserDocs = async (data: any[]) => {
    try {
      await axios(auth.access_token).patch('/api/user/' + userDetails.user_id, {
        documents: data
      });
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className={`transaction-agreement ${className}`}>
      <Backdrop open={loading} />
      <div className='body-content'>
        <DocumentsView documents={documents} handleFileChange={handleFileChange} />

        <div className='section'>
          <Typography variant='body4' className='title'>
            Lostfish transaction agreement
          </Typography>
          <Typography variant='body4'>
            The transaction agreement acts as a guarantee between you, your match and Lostfish that everything
            will be handled according with the UK in force laws.
          </Typography>

          <Button disabled size='small' variant='secondary'>
            Generate agreement
          </Button>
          <div className='note'>
            <Typography variant='body5'>
              <b>Note:</b> The agreement can be generated after you have your ID verified. You can skip this
              step but remember you won’t be able to message your match and close the deal until you generate
              and sign the transaction agreement.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
})`
  &.transaction-agreement {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    .body-content {
      display: grid;
      row-gap: 32px;
      .section {
        display: grid;
        row-gap: 16px;

        .title {
          color: #a7a7a7;
        }
        .note {
          padding: 12px;
          color: #646464;
          background-color: #f3f4f5;
          border-radius: 8px;
        }
      }
    }
  }
`;
