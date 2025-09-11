import { NextResponse } from "next/server";
import { uploadToDrive } from "@/lib/googleDrive";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await uploadToDrive({
      buffer,
      filename: file.name,
      mimeType: file.type,
    });

    return NextResponse.json({ ok: true, file: metadata });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("drive upload error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
