import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  UID: { type: String, required: true },
  Token: Number,
  isCardActive: Boolean,
});

export default mongoose.model("Card", cardSchema);
