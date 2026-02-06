import mongoose from "mongoose";

const FormResponseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    answers: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.FormResponse ||
  mongoose.model("FormResponse", FormResponseSchema);
