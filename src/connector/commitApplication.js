import AWS from "aws-sdk";
import { AWS_CONFIG } from "../config";
AWS.config.update(AWS_CONFIG);
const s3 = new AWS.S3();

export const commitApplication = (app) => {
  const params = {
    Bucket: process.env.REACT_APP_S3_BUCKET,
    Key: `${app.ID}.json`,
    Body: JSON.stringify(app),
  };

  return new Promise((resolve) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading app:", err);
      } else {
        console.log('App "%s" uploaded successfully:', app.Name);
        resolve(data);
      }
    });
  });
};
