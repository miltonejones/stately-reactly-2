import AWS from "aws-sdk";
import { AWS_CONFIG } from "../config";
AWS.config.update(AWS_CONFIG);
const s3 = new AWS.S3();

const S3_BUCKET = "reactlyjson";

export const getApplications = async (resolve) => {
  const params = {
    Bucket: S3_BUCKET,
  };

  const apps = await s3.listObjectsV2(params).promise();

  return apps;
};
