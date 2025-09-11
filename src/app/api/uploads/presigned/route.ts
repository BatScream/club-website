import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { files } = await req.json();
    if (!Array.isArray(files)) {
      return NextResponse.json({ error: "files[] required" }, { status: 400 });
    }

    const registrationId = new mongoose.Types.ObjectId();
    const results = await Promise.all(
      files.map(async (f: { field: string; filename: string; contentType?: string }) => {
        const uuid = uuidv4().replace(/-/g, "");
        const sanitizedFilename = f.filename.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
        const key = `registrations/${registrationId.toString()}/documents/${f.field}/${uuid}_${sanitizedFilename}`;

        const cmd = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: key,
          ContentType: f.contentType || "application/octet-stream",
        });

        const uploadUrl = await getSignedUrl(s3, cmd, {
          expiresIn: parseInt(process.env.UPLOAD_URL_EXPIRATION || "900", 10),
        });

        return { field: f.field, key, filename: f.filename, contentType: f.contentType, uploadUrl, registrationId };
      })
    );

    return NextResponse.json({ ok: true, uploads: results });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
