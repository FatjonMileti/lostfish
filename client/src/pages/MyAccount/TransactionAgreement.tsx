import React from 'react';
import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import axios from '../../utils/axios';
import config from '../../config';

import { useUserStore } from '../../globalState/user';
import { useProfileStore } from '../../globalState/profile';
import { Backdrop } from '../../components/Backdrop';

export const TransactionAgreement = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState(false);

  const { userDetails, auth } = useUserStore();
  const profileStore = useProfileStore();

  React.useEffect(() => {
    getDocuments();
  }, [profileStore]);

  const getDocuments = () => {
    const { documents } = profileStore;
    if (documents?.length > 0) {
      setFileUrl(`${config.apiUrl}/api/file/${documents[0].value}`);
    }
  };

  const handleAddDocumentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          await updateUserDocs([
            {
              type: 'Proof of ID',
              value: response.data[0].key,
              approved: false
            }
          ]);
          await profileStore.fetchProfile(auth.access_token);
          const imagePreview = URL.createObjectURL(selectedFile);
          setFileUrl(imagePreview);
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
        <div className='section'>
          <Typography variant='body4' className='title'>
            ID Verification
          </Typography>
          <Typography variant='body4'>
            Upload a document (jpg, png or pdf) of your valid ID to verify your account. Once verified a badge
            will be visible on your account to indicate that your account is verified.
          </Typography>

          <Button
            size='small'
            variant='secondary'
            startIcon={<Icon icon='plus' size={16} />}
            onClick={handleAddDocumentClick}>
            Add document
          </Button>
          <input
            type='file'
            accept='.jpg, .png, .pdf'
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {fileUrl && <img src={fileUrl} alt='preview' height={200} />}
          <div className='note'>
            <Typography variant='body5'>
              <b>Note:</b> ID verification is mandatory to generate the transaction agreement. You can skip
              this step but remember you won’t be able to message your match and close the deal until you
              generate and sign the transaction agreement.
            </Typography>
          </div>
        </div>

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
