import AWS from "aws-sdk";
const S3_BUCKET = "reactlyjson";
import { AWS_CONFIG } from "../config";
AWS.config.update(AWS_CONFIG);
const s3 = new AWS.S3();

const commitApplication = (app) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: app.ID,
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
