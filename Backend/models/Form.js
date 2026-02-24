const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  id: Number,
  label: String,
  type: String,
  required: Boolean,
  options: Array,
});

const FormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fields: {
      type: [FieldSchema],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Form", FormSchema);
