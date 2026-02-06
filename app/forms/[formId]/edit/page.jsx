"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditFormPage() {
  const { formId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch existing form
  useEffect(() => {
    if (!formId) return;

    fetch(`/api/forms/${formId}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setFields(data.fields);
      })
      .finally(() => setLoading(false));
  }, [formId]);

  // 2️⃣ Update form
  const updateForm = async () => {
    const res = await fetch(`/api/forms/${formId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, fields }),
    });

    if (res.ok) {
      alert("Form updated successfully");
      router.push(`/forms/${formId}`);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Edit Form</h1>

      <input
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Form title"
      />

      {/* Later we’ll reuse your field builder here */}
      <pre className="bg-gray-100 p-3 text-xs">
        {JSON.stringify(fields, null, 2)}
      </pre>

      <button
        onClick={updateForm}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Update Form
      </button>
    </div>
  );
}
