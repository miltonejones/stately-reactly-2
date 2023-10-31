import { MYSQL_API_ENDPOINT } from "../constants";

export const getDemoData = async () => {
  const response = await fetch(`${MYSQL_API_ENDPOINT}/name/boombot/library`);
  return await response.json();
};
