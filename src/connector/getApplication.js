import AWS from "aws-sdk";
import { AWS_CONFIG } from "../config";
AWS.config.update(AWS_CONFIG);
const s3 = new AWS.S3();

const S3_BUCKET = "reactlyjson";

export const getApplication = async (Key) => {
  const jsonParams = {
    Bucket: S3_BUCKET,
    Key,
  };

  const jsonData = await s3.getObject(jsonParams).promise();
  const jsonObject = JSON.parse(jsonData.Body.toString());
  return jsonObject;
};
