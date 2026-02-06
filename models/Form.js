import mongoose from "mongoose";

// const OptionSchema = new mongoose.Schema({
//   label: String,
//   children: [Object], // nested fields (recursive)
// });

const FieldSchema = new mongoose.Schema({
  id:Number,
  label: String,
  type: String,
  required: Boolean,
  options: Array,
});

const FormSchema = new mongoose.Schema(
  {name:{
    type:String,
    required:true
  },
  fields: {
    type: [FieldSchema],
    required:true
  }
},
  { timestamps: true }
);

export default mongoose.models.Form ||
  mongoose.model("Form", FormSchema);
