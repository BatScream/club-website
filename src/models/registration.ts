// src/models/registration.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFileRef {
  filename?: string;
  contentType?: string;
  size?: number;
  key: string; 
  uploadedAt?: Date;
}

export interface IRegistration extends Document {
  email: string;
  playerName: string;
  dob: Date | string;
  gender?: string;
  phone: string;
  emergencyContact?: string;

  position?: string;
  purpose?: string;
  yearsExp?: string;
  previousClub?: string;
  injuries?: string;

  photo: IFileRef;
  idDoc: IFileRef;
  birthProof: IFileRef;

  parentName?: string;
  relationship?: string;
  parentContact?: string;
  occupation?: string;

  consentParticipate: boolean;
  consentLiability: boolean;
  consentMedia: boolean;
  consentAIFF: boolean;

  program?: string;
  paymentMethod?: string;
  upiId?: string;
  paymentReceipt: IFileRef;

  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const FileRefSchema = new Schema<IFileRef>(
  {
    filename: String,
    contentType: String,
    size: Number,
    key: { type: String, required: true },
    uploadedAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const RegistrationSchema = new Schema<IRegistration>({
  email: { type: String, required: true },
  playerName: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  phone: { type: String, required: true },
  emergencyContact: { type: String },

  position: { type: String },
  purpose: { type: String },
  yearsExp: { type: String },
  previousClub: { type: String },
  injuries: { type: String },

  photo: FileRefSchema,
  idDoc: FileRefSchema,
  birthProof: FileRefSchema,

  parentName: { type: String },
  relationship: { type: String },
  parentContact: { type: String },
  occupation: { type: String },

  consentParticipate: { type: Boolean },
  consentLiability: { type: Boolean },
  consentMedia: { type: Boolean },
  consentAIFF: { type: Boolean },

  program: { type: String },
  paymentMethod: { type: String },
  upiId: { type: String },
  paymentReceipt: FileRefSchema,

  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: () => new Date() },
});

export const Registration: Model<IRegistration> = (mongoose.models.Registration as Model<IRegistration>) ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);
