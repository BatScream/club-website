import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

    const cmd = new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME!, Key: key });
    const downloadUrl = await getSignedUrl(s3, cmd, {
      expiresIn: parseInt(process.env.DOWNLOAD_URL_EXPIRATION || "300", 10),
    });

    return NextResponse.json({ ok: true, downloadUrl });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
