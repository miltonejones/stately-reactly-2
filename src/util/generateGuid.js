export default function generateGuid() {
  let guid = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 20; i++) {
    guid += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return guid;
}
