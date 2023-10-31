import CryptoJS from "crypto-js";

export default function decrypt(encrypted) {
  const secretKey = process.env.REACT_APP_ENCRYPT_KEY;
  const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
