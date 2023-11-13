import AWS from "aws-sdk";
import { AWS_CONFIG } from "../config";
AWS.config.update(AWS_CONFIG);
const s3 = new AWS.S3();

export const getApplications = async (resolve) => {
  const params = {
    Bucket: process.env.REACT_APP_S3_BUCKET,
  };

  const apps = await s3.listObjectsV2(params).promise();

  return apps;
};
