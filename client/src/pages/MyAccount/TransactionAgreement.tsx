import React from 'react';
import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { useGlobalState } from '../../globalState/globalState';
import axios from '../../utils/axios';
import config from '../../config';
import { useUser } from '../../context/UserProvider';
import { useUserStore } from '../Login/Login';

export const TransactionAgreement = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);

  const { user } = useUser();

  React.useEffect(() => {
    getDocuments();
  }, [user]);

  const getDocuments = () => {
    if (user) {
      const { documents } = user;
      if (documents?.length > 0) {
        setFileUrl(documents[0].value);
      }
    }
  };

  const { userDetails, auth } = useUserStore();

  const handleAddDocumentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      // Handle the selected file
      const formData = new FormData();

      formData.append('images', selectedFile);
      const response = await axios(auth.access_token).post('/upload-docs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        await updateUserDocs([
          {
            type: 'Proof of ID',
            value: `${config.apiUrl}/url-to-user-docs/${response.data[0].filename}`,
            approved: false
          }
        ]);
        const imagePreview = URL.createObjectURL(selectedFile);
        setFileUrl(imagePreview);
      }
    }
  };

  const updateUserDocs = async (data: any[]) => {
    const response = await axios(auth.access_token).patch('/api/user/' + userDetails.user_id, {
      documents: data
    });
    if (response.status === 200) {
      alert('Updated with success!');
    }
  };

  return (
    <div className={`transaction-agreement ${className}`}>
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
