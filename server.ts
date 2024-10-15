import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import * as Minio from "minio";
import * as env from "./config";
import path from "path";

export const minioPrivate = new Minio.Client({
  region: env.S3_ENDPOINT_REGION,
  endPoint: env.S3_ENDPOINT_URL,
  accessKey: env.S3_PRIVATE_KEY,
  secretKey: env.S3_PRIVATE_SECRET,
});

export const minioPublic = new Minio.Client({
  region: env.S3_ENDPOINT_REGION,
  endPoint: env.S3_ENDPOINT_URL,
  accessKey: env.S3_PUBLIC_KEY,
  secretKey: env.S3_PUBLIC_SECRET,
});

const getRandomName = () => crypto.randomUUID();

const genUrl = (type: string, fileName: string) => {
  if (type === "private") {
    return minioPrivate.presignedPutObject(
      env.S3_PRIVATE_BUCKET,
      fileName,
      3600,
    );
  }

  return minioPublic.presignedPutObject(env.S3_PUBLIC_BUCKET, fileName, 3600);
};

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = express();

server.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.get("/client.js", (_, res) => {
  res.sendFile(path.join(__dirname, "client.js"));
});

server.get("/generate", async (req, res) => {
  const fileExt = req.query.ext;
  const type = req.query.type as string;
  if (!fileExt || !type) {
    res.status(400).json({ message: "missing file extension or upload type" });
    return;
  }

  const fileName = `${getRandomName()}.${fileExt}`;
  const url = await genUrl(type, fileName);
  res.json({ url, fileName });
});

server.listen(env.PORT, () => console.log(`Listening on ${env.PORT}`));
