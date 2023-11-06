import invokeDynamo from "../../connector/invokeDynamo";
import invokeMySQL from "../../connector/invokeMySQL";
import invokeResource from "../../connector/invokeResource";
import { findMatches } from "../../util/findMatches";
import stateRead from "../../util/stateRead";

const dataExec = async (context) => {
  const { page, application, options, currentEvent } = context;
  const { action } = currentEvent;
  const { target, terms } = action;

  const resource = application.resources.find((f) => f.ID === target);
  const connection = application.connections.find(
    (f) => f.ID === resource.connectionID
  );

  if (connection.type === "mysql") {
    const data = await invokeMySQL(connection, resource);
    const packaged = {
      ...application,
      resourceData: {
        [target]: data,
        key: target,
        rows: data,
      },
    };
    return packaged;
    // return {
    //   columns: objectKeys(res),
    //   records: res,
    // };
  }

  if (connection.type === "dynamo") {
    let item = stateRead({
      value: resource.body,
      page,
      application,
      options,
    });
    if (resource.filterValue) {
      const filterValue = stateRead({
        value: resource.filterValue,
        page,
        application,
        options,
      });
      item = {
        filterValue,
        filterKey: resource.filterKey,
      };
    }
    const data = await invokeDynamo(connection, resource, item);
    const rows = resolveRows(data, resource.node.split("/"));
    const packaged = {
      ...application,
      resourceData: {
        [target]: data,
        key: target,
        rows,
      },
    };
    return packaged;
  }

  console.log({ executing: resource.name });

  if (resource.body && resource.method === "POST") {
    let body = resource.body;
    const regex = /"{([^}]+)}"/g;
    const matches = findMatches(regex, resource.body);

    matches.map((term) => {
      const [fullText, innerText] = term;
      const param = stateRead({
        value: innerText,
        page,
        application,
        options,
      });
      body = body.replace(fullText, JSON.stringify(param));
    });
    const data = await invokeResource(connection, resource, null, body);
    // alert(JSON.stringify({ data, body }));
    return application;
  }

  !!terms &&
    Object.keys(terms).map((term) => {
      console.log({ term, value: terms[term] });
      const param = stateRead({
        value: terms[term],
        page,
        application,
        options,
      });
      console.log({ term, param });
      resource.values = resource.values.map((value) =>
        value.key === term
          ? {
              ...value,
              value: param || value.value,
            }
          : value
      );
    });

  const data = await invokeResource(connection, resource);
  const rows = resolveRows(data, resource.node.split("/"));
  const packaged = {
    ...application,
    resourceData: {
      [target]: data,
      key: target,
      rows,
    },
  };
  return packaged;
};

function resolveRows(object, node) {
  const key = node.shift();
  const descendent = object[key];
  if (!!node.length) {
    return resolveRows(descendent, node);
  }

  console.log({ node, key, descendent });
  return descendent;
}

export default dataExec;
