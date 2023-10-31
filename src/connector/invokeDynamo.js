import AWS from "aws-sdk";

function invokeDynamo(connection, resource) {
  return new Promise((resolve, reject) => {
    const dynamodb = new AWS.DynamoDB({
      region: connection.region,
      accessKeyId: connection.accesskey,
      secretAccessKey: connection.secretkey,
    });
    const params = {
      TableName: resource.tablename,
    };

    dynamodb.scan(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (data.Items) {
          const Items = data.Items.map((item) => {
            return Object.keys(item).reduce((out, key) => {
              out[key] = parseProp(item[key]);
              return out;
            }, {});
          });
          resolve({ Items });
        }

        resolve(data);
      }
    });
  });
}

function parseProp(value) {
  if (["string", "number"].some((f) => typeof value === f)) {
    return value;
  }
  if (typeof value === "object") {
    const values = Object.values(value);
    return values[0];
  }
  return JSON.stringify(value);
}

export default invokeDynamo;
