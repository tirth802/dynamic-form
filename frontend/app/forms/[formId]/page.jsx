"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormPreview from "@/components/form-preview/FormPreview";
import  Link  from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FormPreviewPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setForm(data.data);
        }else{
          toast.error("Form not found")
        }
       
      })
      .catch(() => {
        toast.error("Error fetching form");
      })
      .finally(() => setLoading(false));
  }, [formId]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!form) return <p className="p-6">Form not found</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{form.name}</h1>

      <FormPreview fields={form.fields} formId={form._id} />

      <Link href={`/forms/${form._id}/edit`}>
        <Button size="sm" variant="outline" className="mt-2 p-4 bg-blue-300">
          Edit
        </Button>
      </Link>
      <Link href={`/`}>
      <Button  variant="outline" className="ml-2">
        Back </Button>
      </Link>
    </div>
  );
}
