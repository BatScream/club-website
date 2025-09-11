// src/models/player.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  email?: string;
  dob?: Date;
  gender?: string;
  phone?: string;
  emergencyContact?: string;
  parentName?: string;
  parentContact?: string;
  registrationId?: mongoose.Types.ObjectId; // link back to registration
  createdAt?: Date;
  // other fields (sessions, jersey, etc.) can remain in your model as optional
}

const PlayerSchema = new Schema<IPlayer>(
  {
    name: { type: String, required: true },
    email: { type: String },
    dob: { type: Date },
    gender: { type: String },
    phone: { type: String },
    emergencyContact: { type: String },
    parentName: { type: String },
    parentContact: { type: String },
    // reference to registration (so player points to original registration)
    registrationId: { type: Schema.Types.ObjectId, ref: "Registration" },
  },
  {
    timestamps: true,
  }
);

export const Player: Model<IPlayer> = (mongoose.models.Player as Model<IPlayer>) ||
  mongoose.model<IPlayer>("Player", PlayerSchema);
