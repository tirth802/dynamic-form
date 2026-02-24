"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function HomePage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/forms")
      .then((res) => res.json())
      .then((data) => setForms(data.data || []));
  }, []);

  async function deleteForm(id) {
    if (!confirm("Delete this form?")) return;

    const res = await fetch(`http://localhost:5000/api/forms/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      setForms(forms.filter((f) => f._id !== id));
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">My Forms</h1>

        <Link href="/forms/create">
          <Button>Create New Form</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forms.map((form) => (
          <div
            key={form._id}
            className="border rounded p-4 shadow"
          >
            <h1 className="text-medium font-bold">
            Form Name: {form.name}
            </h1>

            <p className="font-medium  text-gray-500">
              Fields: {form.fields.length}
            </p>

            <div className="flex gap-2 mt-3">
              <Link href={`/forms/${form._id}`}>
                <Button size="sm">View</Button>
              </Link>

              <Link href={`/forms/${form._id}/responses`}>
                <Button size="sm" variant="outline">
                  Responses
                </Button>
              </Link>
              
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteForm(form._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
