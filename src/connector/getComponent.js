import { REACTLY_API_ENDPOINT } from "../constants";

export const getComponent = async (name) => {
  const response = await fetch(`${REACTLY_API_ENDPOINT}/mui/${name}`);
  return await response.json();
};
