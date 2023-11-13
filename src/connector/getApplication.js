import AWS from "aws-sdk";
import { AWS_CONFIG } from "../config";
AWS.config.update(AWS_CONFIG);
const s3 = new AWS.S3();

export const getApplication = async (Key) => {
  const jsonParams = {
    Bucket: process.env.REACT_APP_S3_BUCKET,
    Key,
  };

  const jsonData = await s3.getObject(jsonParams).promise();
  const jsonObject = JSON.parse(jsonData.Body.toString());
  return jsonObject;
};
