"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

/* ✅ FIX 1: Define RenderField FIRST */
function RenderField({ field, answers, onChange }) {
  const fieldKey = field._id || field.id;

  return (
    <div className="space-y-2">
      <label className="font-medium">{field.label}</label>

      {/* TEXT */}
      {field.type === "text" && (
        <input
          className="border p-2 rounded w-full"
          value={answers[fieldKey] || ""}
          onChange={(e) => {
            onChange(fieldKey, e.target.value);
          }}
        />
      )}

      {/* RADIO */}
      {field.type === "radio" &&
        field.options.map((opt) => (
          <div key={`${fieldKey}-${opt.label}`}>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={fieldKey}
                checked={answers[fieldKey] === opt.label}
                onChange={() => {
                  // ✅ Clear previous children answers
                  const prevSelected = answers[fieldKey];
                  if (prevSelected && prevSelected !== opt.label) {
                    const prevOption = field.options.find(
                      (o) => o.label === prevSelected,
                    );
                    if (prevOption?.children) {
                      prevOption.children.forEach((child) => {
                        const childKey = child._id || child.id;
                        // remove child answers
                        onChange(childKey, undefined);
                      });
                    }
                  }
                  // ✅ Set new selected value
                  onChange(fieldKey, opt.label);
                }}
              />
              {opt.label}
            </label>

            {answers[fieldKey] === opt.label &&
              opt.children?.map((child) => (
                <div
                  key={`${fieldKey}-${child._id || child.id}`}
                  className="ml-6 mt-2 border-l pl-4"
                >
                  <RenderField
                    field={child}
                    answers={answers}
                    onChange={onChange}
                  />
                </div>
              ))}
          </div>
        ))}

      {/* SELECT */}
      {field.type === "select" && (
        <div>
          <select
            className="border p-2 rounded w-full"
            value={answers[fieldKey] || ""}
            onChange={(e) => onChange(fieldKey, e.target.value)}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((opt) => (
              <option key={`${fieldKey}-${opt.label}`} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* ✅ Render children of the selected option */}
          {field.options
            .find((opt) => opt.label === answers[fieldKey])
            ?.children?.map((child) => (
              <div
                key={`${fieldKey}-${child._id || child.id}`}
                className="ml-6 mt-2 border-l pl-4"
              >
                <RenderField
                  field={child}
                  answers={answers}
                  onChange={onChange}
                />
              </div>
            ))}
        </div>
      )}

      {/* CHECKBOX */}
      {field.type === "checkbox" &&
        field.options.map((opt) => {
          const selected = answers[fieldKey] || [];

          return (
            <div key={`${fieldKey}-${opt.label}`}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(opt.label)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...selected, opt.label]
                      : selected.filter((v) => v !== opt.label);

                    onChange(fieldKey, updated);
                  }}
                />
                {opt.label}
              </label>

              {selected.includes(opt.label) &&
                opt.children?.map((child) => (
                  <div
                    key={`${fieldKey}-${child._id || child.id}`}
                    className="ml-6 mt-2 border-l pl-4"
                  >
                    <RenderField
                      field={child}
                      answers={answers}
                      onChange={onChange}
                    />
                  </div>
                ))}
            </div>
          );
        })}
    </div>
  );
}

/* ✅ FIX 2: FormPreview AFTER RenderField */
export default function FormPreview({
  fields,
  formId,
  initialAnswers = {},
  responseId,
  mode = "create",
}) {
  const [answers, setAnswers] = useState(initialAnswers);

  //  const{id}=fields
  //  console.log("problem",id)
  const handleChange = (fieldId, value) => {
    // console.log("YES:",fieldId)
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formId) {
      toast.warning("formId missing");
      return;
    }

    try {
      const url =
        mode === "edit"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/form-responses/${responseId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/form-responses`;
      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "edit" ? { answers } : { formId, answers },
        ),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          mode === "edit"
            ? "Response updated successfully"
            : "Form submitted successfully",
        );

        if (mode === "create") setAnswers({});
      } else {
        toast.error(data.message || "Error submitting form");
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    }
  };

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <RenderField
          key={field._id || field.id}
          field={field}
          answers={answers}
          onChange={handleChange}
        />
      ))}

      <pre className="bg-gray-100 p-3 rounded text-xs">
        {JSON.stringify(answers, null, 2)}
      </pre>

      <Button onClick={handleSubmit}>
        {mode === "edit" ? "Update Response" : "Submit "}
      </Button>
    </div>
  );
}
