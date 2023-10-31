import { REACTLY_API_ENDPOINT } from "../constants";

export const getComponents = async () => {
  const response = await fetch(`${REACTLY_API_ENDPOINT}/mui`);
  return await response.json();
};
