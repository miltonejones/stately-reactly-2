import AWS from "aws-sdk";

export default function describeDynamo(connection) {
  const dynamodb = new AWS.DynamoDB({
    region: connection.region,
    accessKeyId: connection.accesskey,
    secretAccessKey: connection.secretkey,
  });

  return new Promise((resolve, reject) => {
    dynamodb.listTables((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.TableNames);
      }
    });
  });
}
