import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema({
  title: {
    type: String,
  },
  subject: {
    type: String,
  },
  detail: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "active",
  },
});

Schema.plugin(mongoosePaginate);

export default mongoose.model("Report", Schema);
