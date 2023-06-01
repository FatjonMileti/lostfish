import React, { ChangeEvent, FC, useState } from 'react';
import axios from '../../../utils/axios';
import Grid from '@mui/material/Grid';
import { useGlobalState } from '../../../globalState';
interface MyComponentProps {
  handleImagesUpload: (images: any[], item?: any) => void;
  url?: string;
  multiple?: boolean;
  type?: any;
}
export const UploadImages: FC<MyComponentProps> = ({ handleImagesUpload, url, multiple, type }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    user: [{ auth }]
  } = useGlobalState();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
      const imagePreviews = files.map((file) => {
        return URL.createObjectURL(file);
      });

      setSelectedImages([...selectedImages, ...imagePreviews]);
    }
  };

  const uploadImages = async () => {
    const formData = new FormData();
    if (selectedFiles.length === 0) {
      return;
    }
    selectedFiles.forEach((file, i) => {
      formData.append('images', file);
    });

    try {
      const response = await axios(auth.access_token).post(url ? url : '/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSelectedImages([]);
      setSelectedFiles([]);
      handleImagesUpload(
        response.data.map((item: any) => ({
          originalName: item.originalname,
          filename: item.filename,
          path: item.path
        })),
        type
      );
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const deleteImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Grid item style={{ marginTop: '4rem' }} md={12}>
        <input type='file' onChange={handleImageUpload} multiple={!!multiple} accept='image/*' />
        {selectedFiles.length > 0 && <button onClick={uploadImages}>Confirm</button>}
        <div style={{ display: 'flex' }}></div>
      </Grid>
      {selectedImages.map((src, index) => (
        <Grid item md={3} spacing={1}>
          <button onClick={() => deleteImage(index)}>Delete</button>
          <img key={index} src={src} alt='preview' height={100} />
        </Grid>
      ))}
    </>
  );
};
