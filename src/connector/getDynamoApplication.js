import AWS from "aws-sdk";
import { AWS_CONFIG } from "../config";

export default function getDynamoApplication(name) {
  const dynamodb = new AWS.DynamoDB(AWS_CONFIG);
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "reactly-apps",

      // query filter
      FilterExpression: "#attr = :data_value",

      // alias db column names
      ExpressionAttributeNames: {
        "#attr": "path",
      },

      // query filter values
      ExpressionAttributeValues: {
        ":data_value": {
          S: name,
        },
      },
    };

    dynamodb.scan(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (data.Items) {
          return resolve(data.Items.pop());
        }
        resolve(data);
      }
    });
  });
}
