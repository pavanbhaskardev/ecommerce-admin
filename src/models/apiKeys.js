import mongoose from "mongoose";
import crypto from "crypto";

const apiKeySchema = new mongoose.Schema(
  {
    keyHash: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    permission: {
      type: String,
      enum: ["read", "read/write"],
      default: "read",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

apiKeySchema.statics.generateKey = function () {
  return crypto.randomBytes(32).toString("hex");
};

apiKeySchema.statics.hashKey = function (key = "") {
  return crypto.createHash("sha256").update(key).digest("hex");
};

const ApiKeys =
  mongoose.models.ApiKeys || mongoose.model("ApiKeys", apiKeySchema);
export default ApiKeys;
