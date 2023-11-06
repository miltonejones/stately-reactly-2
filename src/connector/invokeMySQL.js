// import jwt from "jsonwebtoken";
const ENDPOINT = "https://ftrkh5l4wa.execute-api.us-east-1.amazonaws.com";

export default async function invokeMySQL(connection, resource) {
  const response = await fetch(
    ENDPOINT + `/open/1/${resource.tablename}`,
    requestOptions(connection)
  );
  const json = await response.json();
  const res = json.rows;

  return res;
}

export const getTables = async (connection) => {
  const response = await fetch(
    ENDPOINT + "/connect",
    requestOptions(connection)
  );
  const json = await response.json();
  return json.rows.map((row) => Object.values(row)[0]);
};

export const getTable = async (connection, resource) => {
  const response = await fetch(
    ENDPOINT + `/show/${resource.tablename}`,
    requestOptions(connection)
  );
  const json = await response.json();
  return json.rows.map((row) => Object.values(row)[0]);
};

const requestOptions = (connection) => {
  const config = connection.config;
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: JSON.stringify(token),
      "Database-Config": JSON.stringify(connection.config),
    },
  };
};
