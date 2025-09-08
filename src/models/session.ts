// models/session.ts
import mongoose, { InferSchemaType } from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true }, // session start timestamp
    name: { type: String, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // players who attended
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "sessions" }
);

export type SessionType = InferSchemaType<typeof SessionSchema>;

export const Session =
  (mongoose.models.Session as mongoose.Model<SessionType>) ||
  mongoose.model<SessionType>("Session", SessionSchema);
