// models/player.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  age: number;
  jersey: number;
  createdAt: Date;
}

const PlayerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  jersey: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// mongoose will map model 'Player' -> collection 'players'
export const Player =
  (mongoose.models.Player as mongoose.Model<IPlayer>) ||
  mongoose.model<IPlayer>("Player", PlayerSchema);
