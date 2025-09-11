import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { downloadFromDrive, getDriveFile } from "@/lib/googleDrive";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");
  if (!fileId) {
    return NextResponse.json({ error: "fileId required" }, { status: 400 });
  }

  try {
    const metadata = await getDriveFile(fileId);
    const stream = await downloadFromDrive(fileId);

    return new Response(stream as any, {
      headers: {
        "Content-Type": metadata.mimeType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${metadata.name}"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
