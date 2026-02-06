"use client";

import { useState } from "react";
import FormBuilder from "@/components/form-builder/FormBuilder";
import FormPreview from "@/components/form-preview/FormPreview";

export default function CreateFormPage() {
  const [schema, setSchema] = useState([]);
  //  console.log("Dataa",schema._id)
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <FormBuilder onSave={setSchema} />
      <FormPreview fields={schema.fields ||[]} formId={schema._id} />
      
    </div>
  );
}
