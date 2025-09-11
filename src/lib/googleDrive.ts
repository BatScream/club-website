// src/lib/googleDrive.ts
import { google } from "googleapis";
import { Readable } from "stream";

const drive = google.drive({
  version: "v3",
  auth: new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive"],
  }),
});
/** Uploads a file buffer to Google Drive and returns its metadata */
export async function uploadToDrive(
  file: { buffer: Buffer; filename: string; mimeType: string }
) {
  const res = await drive.files.create({
    requestBody: {
      name: file.filename,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    media: {
      mimeType: file.mimeType,
      body: Readable.from(file.buffer),
    },
    fields: "id, name, mimeType, webViewLink, webContentLink",
  });

  return res.data;
}

/** Downloads a file from Google Drive by file ID */
export async function downloadFromDrive(fileId: string) {
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );
  return res.data as Readable;
}

/** Get metadata for a file */
export async function getDriveFile(fileId: string) {
  const res = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, webViewLink, webContentLink",
  });
  return res.data;
}
