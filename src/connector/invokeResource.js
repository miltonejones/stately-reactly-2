export default async function invokeResource(
  connection,
  resource,
  parameters,
  body
) {
  const url = [`${connection.root}${resource.path}`];
  const delimiter = resource.format === "rest" ? "/" : "?";

  if (resource.format === "rest") {
    const params = parameters || resource.values.map((f) => f.value).join("/");
    url.push(params);
  } else {
    const params =
      parameters || resource.values.map((f) => `${f.key}=${f.value}`).join("&");
    url.push(params);
  }

  const address = url.filter((f) => !!f).join(delimiter);

  if (resource.method.toLowerCase() === "post") {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    };
    const response = await fetch(address, requestOptions);
    return await response.json();
  }

  if (resource.method.toLowerCase() === "get") {
    const response = await fetch(address);
    return await response.json();
  }

  // return await response.json();
  // if (resource.method.toLowerCase() === "get") {
  //   if (resource.format === "rest") {
  //     const params =
  //       parameters || resource.values.map((f) => f.value).join("/");
  //     const response = await fetch([url, params].filter((f) => !!f).join("/"));
  //     return await response.json();
  //   }
  //   const params =
  //     parameters || resource.values.map((f) => `${f.key}=${f.value}`).join("&");
  //   const response = await fetch([url, params].filter((f) => !!f).join("?"));
  //   return await response.json();
  // }

  // if (resource.method.toLowerCase() === "post") {
  //   const requestOptions = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body,
  //   };
  //   const response = await fetch(url, requestOptions);
  //   return await response.json();
  // }
  console.log("%cUNSUPPORTED METHOD", "color: lime", {
    connection,
    resource,
    parameters,
  });
}
