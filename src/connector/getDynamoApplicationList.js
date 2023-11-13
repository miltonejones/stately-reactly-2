import AWS from "aws-sdk";
import { AWS_CONFIG } from "../config";

export default function getDynamoApplicationList() {
  const dynamodb = new AWS.DynamoDB(AWS_CONFIG);

  return new Promise((resolve, reject) => {
    const params = {
      TableName: "reactly-apps",
    };

    dynamodb.scan(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (data.Items) {
          return resolve(data.Items);
        }

        resolve(data);
      }
    });
  });
}
