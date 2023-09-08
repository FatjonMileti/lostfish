import bcrypt from 'bcrypt';
import { fileService } from '../index';

import { areArraysOfObjectsIdentical } from '../api.helpers';

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

export const handleUserDocuments = (existingImages: any[], incomingImages: any[]) => {
  if (areArraysOfObjectsIdentical(existingImages, incomingImages)) {
    return [...incomingImages];
  } else {
    const imagesToDelete = existingImages.filter(
      (img: any) => !incomingImages.some((newImg: any) => newImg.key === img.key)
    );

    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach((img: any) => {
        fileService.deleteFile(img.key).then(() => console.log('File Deleted!'));
      });
    }

    return incomingImages;
  }
};
