import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  UID: { type: String, required: true },
  isInside: { type: Boolean, default: false },
  appData: { type: Object, default: {} },
});

export default mongoose.model("Visitor", visitorSchema);
