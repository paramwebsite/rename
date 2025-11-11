import mongoose from "mongoose";

const stations = ["rename", "palm", "music"];

const eventSchema = new mongoose.Schema({
  UID: { type: String, required: true },
  stationId: { type: String, enum: stations, required: true },
  eventType: { type: String, enum: ["cardDetected", "cardLifted"], required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Event", eventSchema);
