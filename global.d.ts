// global.d.ts
import mongoose from "mongoose";

declare global {
  /**
   * A simple cache used only for dev hot-reload stability.
   * Use a distinct name (_mongoose) to avoid colliding with the mongoose module symbol.
   */
  // eslint-disable-next-line no-var
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

export {};
