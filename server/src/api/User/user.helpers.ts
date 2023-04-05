import crypto from "crypto";
import bcrypt from "bcrypt";

export const generatePassword = (
  length: number = Math.floor(Math.random() * 2) + 6, //6-8 characters
  chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => chars[x % chars.length])
    .join("");

export const hashPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, (err, generatedHash) => {
      if (err) return reject(err);
      resolve(generatedHash);
    });
  });
};
