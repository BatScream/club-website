// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please add your Mongo URI to .env.local");
}

// initialize global cache if missing (in dev this persists across HMR)
if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  // return cached connection if available
  if (global._mongoose!.conn) {
    return global._mongoose!.conn;
  }

  // create promise if not already created
  if (!global._mongoose!.promise) {
    global._mongoose!.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  // await and cache connection
  global._mongoose!.conn = await global._mongoose!.promise;
  return global._mongoose!.conn;
}
