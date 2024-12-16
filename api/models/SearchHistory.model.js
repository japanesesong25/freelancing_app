import mongoose from "mongoose";
const { Schema } = mongoose;

const SearchHistorySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    searches: {
      type: [String],
      required: true,
    },
    lastUpdated: {
      type: Date,
      required: true,
    },
  }
);


export default mongoose.model("SearchHistory", SearchHistorySchema);