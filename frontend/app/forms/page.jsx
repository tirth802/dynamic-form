"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FormsPage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms`)
      .then((res) => res.json())
      .then((data) => setForms(data.data || []));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">All Forms</h1>

      {forms.map((form) => (
        <div
          key={form._id}
          className="border p-4 rounded flex justify-between items-center"
        >
          <div>
            <h1 className="font-medium">Form ID: {form.name}</h1>
            <p className="text-sm text-gray-500">
              Fields: {form.fields.length}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={`/forms/${form._id}`}>
              <Button size="sm">View</Button>
            </Link>

            <Link href={`/forms/${form._id}/responses`}>
              <Button size="sm" variant="outline">
                Responses
              </Button>
            </Link>

            
          </div>
        </div>
      ))}
    </div>
  );
}
