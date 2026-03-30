import mongoose from "mongoose";

const HealthSchema = new mongoose.Schema(
  {
    stationId: { type: String, required: true },
    type: { type: String, required: true },

    status: {type: String,enum: ["ok", "warning", "error"],required: true, },

    metrics: { type: Object, default: {} },
    errors: { type: [ErrorSchema], default: [] },
    meta: { type: Object, default: {} },

    lastSeenAt: { type: Date, required: true },
  },
  { timestamps: true }
); 

HealthSchema.index({ stationId: 1, type: 1 }, { unique: true });

export default mongoose.model("Health", HealthSchema);