import { REACTLY_API_ENDPOINT } from "../constants";

export const commitComponent = async (component) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(component),
  };
  const response = await fetch(
    REACTLY_API_ENDPOINT + "/commit",
    requestOptions
  );
  return await response.json();
};
