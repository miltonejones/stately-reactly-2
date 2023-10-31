import CryptoJS from "crypto-js";

export default function encrypt(str) {
  const secretKey = process.env.REACT_APP_ENCRYPT_KEY;
  const encrypted = CryptoJS.AES.encrypt(str, secretKey).toString();
  return encrypted;
}
