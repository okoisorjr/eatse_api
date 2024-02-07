/* eslint-disable prettier/prettier */

import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { HttpException, HttpStatus } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-empty-function */
const uploadFile = async (
  filename: string,
  filetype: string,
  file: Buffer,
  bucket: string,
  user_id?: string,
) => {
  // variable declarations
  let img_URL;
  const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
  });

  const key = `${filename}${new Date().getTime()}`.trim();
  let fileURL: PutObjectCommandOutput;
  try {
    fileURL = await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
        ACL: 'public-read',
        ContentType: filetype,
      }),
    );
  } catch (err) {
    console.log(err);
    return err;
  }

  if (fileURL.$metadata.httpStatusCode !== 200) {
    throw new HttpException(
      'FILE WAS NOT SAVED TO BUCKET!',
      HttpStatus.EXPECTATION_FAILED,
    );
  }

  if (user_id) {
    img_URL = `https://${bucket}.s3.amazonaws.com/${user_id}`;
  } else {
    img_URL = `https://${bucket}.s3.amazonaws.com/${key}`;
  }
  return { img_URL: img_URL };
};

export default uploadFile;
