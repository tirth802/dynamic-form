"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormPreview from "@/components/form-preview/FormPreview";

export default function FormPreviewPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formId) return;

    fetch(`/api/forms/${formId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setForm(data.data);
        }
        setLoading(false);
      });
  }, [formId]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!form) return <p className="p-6">Form not found</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {form.name}
      </h1>

      <FormPreview
        fields={form.fields}
        formId={form._id}
      />
    </div>
  );
}
