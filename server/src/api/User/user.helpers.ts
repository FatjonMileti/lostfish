import bcrypt from 'bcrypt';
import config from '../../config';
import fileService from '../File/services/file.service';
import S3UploadService from '../File/services/s3-file.service';
const s3UploaderService = S3UploadService.getInstance();

export const hashPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, (err, generatedHash) => {
      if (err) return reject(err);
      resolve(generatedHash);
    });
  });
};

export const isPasswordStrong = (password: string): { is_strong: boolean; message: string } => {
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      is_strong: false,
      message: 'should_have_uppercase'
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      is_strong: false,
      message: 'should_have_number'
    };
  }

  // Check for at least one symbol
  if (!/[!@#$%^&*()\-=_+[\]{}|\\;:'",.<>?/]/.test(password)) {
    return {
      is_strong: false,
      message: 'should_have_symbol'
    };
  }

  // Check if password length is greater than 8 characters
  if (password.length < 8) {
    return {
      is_strong: false,
      message: 'password_length_less_than_eight'
    };
  }

  return {
    is_strong: true,
    message: ''
  };
};

interface AnyObject {
  [key: string]: any;
}

export const areArraysOfObjectsIdentical = (arr1: AnyObject[], arr2: AnyObject[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    if (!isObjectEqual(obj1, obj2)) {
      return false;
    }
  }

  return true;
};

function isObjectEqual(obj1: AnyObject, obj2: AnyObject): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export const handleUserDocuments = (existingImages: any[], incomingImages: any[]) => {
  if (areArraysOfObjectsIdentical(existingImages, incomingImages)) {
    return [...incomingImages];
  } else {
    const imagesToDelete = existingImages.filter(
      (img: any) => !incomingImages.some((newImg: any) => newImg.key === img.key)
    );

    if (imagesToDelete.length > 0) {
      if (config.uses3Bucket) {
        imagesToDelete.forEach((img: any) => {
          s3UploaderService.deleteImage(img.key);
        });
      } else {
        imagesToDelete.forEach((img: any) => {
          fileService.removeFile(img.key);
        });
      }
    }

    return incomingImages;
  }
};
