// models/session.ts
import mongoose, { InferSchemaType } from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    name: { type: String, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  },
  { collection: "sessions", timestamps: true }
);

export type SessionType = InferSchemaType<typeof SessionSchema>;

export const Session =
  (mongoose.models.Session as mongoose.Model<SessionType>) ||
  mongoose.model<SessionType>("Session", SessionSchema);
