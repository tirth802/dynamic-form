"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FormBuilder from "@/components/form-builder/FormBuilder";
import { toast } from "sonner";

export default function EditFormPage() {
  const { formId } = useParams();
  const router = useRouter();
  
  const[title,setTitle]=useState()
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch existing form
  useEffect(() => {
    if (!formId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFields(data.data.fields);
          setTitle(data.data.name)
        }else{
          toast.error("Form not found")
        }
      })
      .catch(() => toast.error("Error fetching form"))
      .finally(() => setLoading(false));
  }, [formId]);

  // 🔹 Update form
  const handleUpdate = async (updatedFields) => {
  try {
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    const data = await res.json();
    if (data.success) {
    toast.success("Form updated");
    router.push(`/forms/${formId}`);
  }else{
    toast.error(data.message || "Error1 updating form");
  }
  } catch (err) {
    console.error(err);
    toast.error("Update failed");
  }
}
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Form</h1>

      <FormBuilder
      
        initialFields={fields}
        initialTitle={title}
        onSave={handleUpdate}
      />
    </div>
  );
}
