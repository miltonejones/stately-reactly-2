import AWS from "aws-sdk";
import { AWS_CONFIG } from "../config";
AWS.config.update(AWS_CONFIG);
const s3 = new AWS.S3();

const S3_BUCKET = "reactlyjson";
export const commitApplication = (app) => {
  const params = {
    Bucket: S3_BUCKET,
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
