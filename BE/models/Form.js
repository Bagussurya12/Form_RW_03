import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    questions: {
      type: Array,
    },
    invites: {
      type: Array,
    },
    public: {
      type: Boolean, //Public : true || private : false
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);
Schema.plugin(mongoosePaginate);
Schema.virtual("answers", {
  ref: "Answer", //the model To USe /nama model yang di relasikan
  localField: "_id", //_id yang ada di model Form
  foreignField: "formId", //formId yang ada di model Answer
});

export default mongoose.model("Form", Schema);
