import CryptoJS from "https://esm.sh/crypto-js";

export function encryptString(str, passphrase) {
  return CryptoJS.AES.encrypt(str, passphrase).toString();
}

export function decryptString(encryptedString, passphrase) {
  const bytes = CryptoJS.AES.decrypt(encryptedString, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function generateRandomString(length = 32) {
  // Declare all characters
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Pick characers randomly
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
}
