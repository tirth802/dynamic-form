const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true, enum: ["text", "textarea", "radio", "checkbox", "select", "date", "file", "image", "pdf", "video"] },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] },
  placeholder: { type: String, default: '' },
  defaultValue: { type: mongoose.Schema.Types.Mixed },
  validation: { type: mongoose.Schema.Types.Mixed },
});
 
const FormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    theme: {
      backgroundColor: { type: String, default: '#ffffff' },
      textColor: { type: String, default: '#000000' },
      headerImage: { type: String },
    },
    settings: {
      allowMultipleResponses: { type: Boolean, default: false },
      collectEmail: { type: Boolean, default: false },
    },
    fields: {
      type: [FieldSchema],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Form", FormSchema);
