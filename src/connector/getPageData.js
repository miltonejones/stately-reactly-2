import { MYSQL_API_ENDPOINT } from "../constants";

export const getPathData = async (path) => {
  const response = await fetch(`${MYSQL_API_ENDPOINT}/name/boombot/${path}`);
  return await response.json();
};
