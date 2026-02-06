"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ResponsesPage() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formId) return;

    fetch(`/api/form-responses?formId=${formId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResponses(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [formId]);

  if (loading) {
    return <p className="p-6">Loading responses...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Form Responses</h1>

      {responses.length === 0 && (
        <p className="text-gray-500">No responses yet.</p>
      )}

      {responses.map((res, index) => (
        <div
          key={res._id}
          className="border rounded p-4 space-y-2"
        >
          <h3 className="font-semibold">
            Response #{index + 1}
          </h3>

          <pre className="bg-gray-100 p-3 rounded text-sm">
            {JSON.stringify(res.answers, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}
