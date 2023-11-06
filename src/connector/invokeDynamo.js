import AWS from "aws-sdk";
import { restoreObjectLabels } from "../util/restoreObjectLabels";

function invokeDynamo(connection, resource, item) {
  const dynamodb = new AWS.DynamoDB({
    region: connection.region,
    accessKeyId: connection.accesskey,
    secretAccessKey: connection.secretkey,
  });

  // PUT - save record body
  if (resource.method === "PUT") {
    return new Promise((resolve, reject) => {
      const Item = restoreObjectLabels(item);
      console.log({ Item });
      const params = {
        TableName: resource.tablename,
        Item,
      };

      dynamodb.putItem(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: "Item added successfully", data });
        }
      });
    });
  }

  // DELETE - delete record by ID
  if (!!item && item.filterKey && resource.method === "DELETE") {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: resource.tablename,
        Key: {
          [item.filterKey]: { S: item.filterValue },
        },
      };

      dynamodb.deleteItem(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: "Item deleted successfully", data });
        }
      });
    });
  }

  // SCAN - get all records
  return new Promise((resolve, reject) => {
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
