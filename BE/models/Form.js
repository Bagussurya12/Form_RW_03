// Form.js
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const optionSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  value: String,
});

const questionSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    enum: ["Text", "Radio", "Checkbox", "Dropdown", "Email"],
    required: true,
  },
  question: String,
  options: [optionSchema], // Menggunakan skema untuk options
  required: Boolean,
});

const formSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    title: String,
    description: String,
    questions: [questionSchema], // Menggunakan skema untuk questions
    invites: [String], // Misalnya, invites adalah array dari string
    public: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);

formSchema.plugin(mongoosePaginate);

formSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "formId",
});

formSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Form", formSchema);
