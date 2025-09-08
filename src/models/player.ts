// models/player.ts
import mongoose, { InferSchemaType } from "mongoose";

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  jersey: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// export a type inferred from the schema
export type PlayerType = InferSchemaType<typeof PlayerSchema>;

// Create / reuse the model
export const Player =
  (mongoose.models.Player as mongoose.Model<PlayerType>) ||
  mongoose.model<PlayerType>("Player", PlayerSchema);
