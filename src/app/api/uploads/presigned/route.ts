import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

    const results = await Promise.all(
      files.map(async (f: { field: string; filename: string; contentType?: string }) => {
        const key = `registrations/${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${f.filename}`;

        const cmd = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: key,
          ContentType: f.contentType || "application/octet-stream",
        });

        const uploadUrl = await getSignedUrl(s3, cmd, {
          expiresIn: parseInt(process.env.UPLOAD_URL_EXPIRATION || "900", 10),
        });

        return { field: f.field, key, filename: f.filename, contentType: f.contentType, uploadUrl };
      })
    );

    return NextResponse.json({ ok: true, uploads: results });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
