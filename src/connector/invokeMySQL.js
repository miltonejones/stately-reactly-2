import { clauseDef } from "../components/lib/ConfigurationDrawer/PredicateList";

// import jwt from "jsonwebtoken";
const ENDPOINT = "https://ftrkh5l4wa.execute-api.us-east-1.amazonaws.com";

export default async function invokeMySQL(connection, resource, pageNum = 1) {
  const options = requestOptions(connection);
  const prefix = [`SELECT * FROM ${resource.tablename}`];
  const order = !resource.order
    ? null
    : `ORDER BY ${resource.order} ${resource.direction}`;

  const where = !resource.predicates
    ? null
    : `WHERE ${resource.predicates
        .map((pred) => {
          const transformer = clauseDef[pred.condition];
          const transformText = transformer(pred.property, pred.operand);

          return `${pred.operator} ${transformText}`;
        })
        .join("\n")}`;

  const query = [prefix, where, order].filter(Boolean).join(" ");

  const pageSize = resource.size || 100;
  const response = await fetch(ENDPOINT + `/query/${pageNum}/${pageSize}`, {
    ...options,
    body: JSON.stringify({ query }),
  });
  const json = await response.json();
  // const res = json.rows;

  return json;
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
