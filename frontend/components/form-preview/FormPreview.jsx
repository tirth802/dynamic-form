"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Image from "next/image";

/* ✅ FIX 1: Define RenderField FIRST */
function RenderField({ field, answers, onChange }) {
  const [uploading, setUploading] = useState({});
  const fieldKey = field._id || field.id;

  /**
   * Upload file to Cloudinary
   */
  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      setUploading((prev) => ({ ...prev, [fieldKey]: true }));
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        // store both url and publicId so backend can delete later
        onChange(fieldKey, { url: data.data.url, publicId: data.data.publicId });
      } else {
        console.error('Server responded with error during upload', data);
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed, see console');
    } finally {
      setUploading((prev) => ({ ...prev, [fieldKey]: false }));
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-medium">{field.label}</label>

      {/* TEXT */}
      {field.type === "text" && (
        <input
          className="border p-2 rounded w-full"
          placeholder={field.placeholder || ""}
          value={answers[fieldKey] || ""}
          onChange={(e) => {
            onChange(fieldKey, e.target.value);
          }}
          required={field.required}
        />
      )}

      {/* TEXTAREA */}
      {field.type === "textarea" && (
        <textarea
          className="border p-2 rounded w-full"
          placeholder={field.placeholder || ""}
          value={answers[fieldKey] || ""}
          onChange={(e) => {
            onChange(fieldKey, e.target.value);
          }}
          required={field.required}
          rows={4}
        />
      )}

      {/* DATE */}
      {field.type === "date" && (
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={answers[fieldKey] || ""}
          onChange={(e) => {
            onChange(fieldKey, e.target.value);
          }}
          required={field.required}
        />
      )}

      {/* FILE UPLOAD */}
      {field.type === "file" && (
        <div className="space-y-2">
          <input
            type="file"
            className="border p-2 rounded w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            disabled={uploading[fieldKey]}
            required={field.required}
          />
          {uploading[fieldKey] && <p className="text-sm text-gray-500">Uploading...</p>}
          {answers[fieldKey] && (
            <div className="space-y-1">
              <p className="text-sm text-green-600">✓ File uploaded</p>
              <a
                href={typeof answers[fieldKey] === 'object' ? answers[fieldKey].url : answers[fieldKey]}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                View file
              </a>
            </div>
          )}
        </div>
      )}

      {/* IMAGE UPLOAD */}
      {field.type === "image" && (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            disabled={uploading[fieldKey]}
            required={field.required}
          />
          {uploading[fieldKey] && <p className="text-sm text-gray-500">Uploading...</p>}
          {answers[fieldKey] && (
            <div className="space-y-2">
              <p className="text-sm text-green-600">✓ Image uploaded</p>
              {/* use Next.js Image with fixed dimensions; external URLs require width & height */}
              <Image
                src={
                  typeof answers[fieldKey] === 'object'
                    ? answers[fieldKey].url
                    : answers[fieldKey]
                }
                alt="preview"
                width={160}
                height={128}
                className="max-w-xs h-32 object-cover rounded"
              />
            </div>
          )}
        </div>
      )}

      {/* PDF UPLOAD */}
      {field.type === "pdf" && (
        <div className="space-y-2">
          <input
            type="file"
            accept=".pdf"
            className="border p-2 rounded w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            disabled={uploading[fieldKey]}
            required={field.required}
          />
          {uploading[fieldKey] && <p className="text-sm text-gray-500">Uploading...</p>}
          {answers[fieldKey] && (
            <a href={
                typeof answers[fieldKey] === 'object'
                  ? answers[fieldKey].url
                  : answers[fieldKey]
              } target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
              ✓ PDF uploaded - Click to view
            </a>
          )}
        </div>
      )}

      {/* VIDEO UPLOAD */}
      {field.type === "video" && (
        <div className="space-y-2">
          <input
            type="file"
            accept="video/*"
            className="border p-2 rounded w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            disabled={uploading[fieldKey]}
            required={field.required}
          />
          {uploading[fieldKey] && <p className="text-sm text-gray-500">Uploading...</p>}
          {answers[fieldKey] && (
            <div className="space-y-2">
              <p className="text-sm text-green-600">✓ Video uploaded</p>
              <video src={
                typeof answers[fieldKey] === 'object'
                  ? answers[fieldKey].url
                  : answers[fieldKey]
              } controls className="max-w-xs h-32 rounded" />
            </div>
          )}
        </div>
      )}

      {/* RADIO */}
      {field.type === "radio" &&
        (field.options || []).map((opt) => (
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
                    const prevOption = (field.options || []).find(
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
            {(field.options || []).map((opt) => (
              <option key={`${fieldKey}-${opt.label}`} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* ✅ Render children of the selected option */}
          {(field.options || [])
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
        (field.options || []).map((opt) => {
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
  formData = {}, // Complete form data with description, theme, settings
}) {
  // Initialize answers with field defaultValues
  const initializeAnswers = () => {
    const initialized = { ...initialAnswers };
    fields.forEach((field) => {
      const fieldKey = field._id || field.id;
      if (!(fieldKey in initialized) && field.defaultValue) {
        initialized[fieldKey] = field.defaultValue;
      }
    });
    return initialized;
  };

  const [answers, setAnswers] = useState(initializeAnswers);
  const { description = "", theme = {}, settings = {} } = formData;
  const { backgroundColor = "#ffffff", textColor = "#000000", headerImage = "" } = theme;
  const { collectEmail = false } = settings;

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
    <div className="space-y-6" style={{ backgroundColor, color: textColor, padding: "20px", borderRadius: "8px" }}>
      {/* Header Image */}
      {headerImage && (
        <Image src={headerImage} alt="Form header" className="w-full h-48 object-cover rounded" />
      )}

      {/* Form Description */}
      {description && (
        <div className="text-sm text-gray-600 pb-4 border-b">
          {description}
        </div>
      )}

      {/* Email Field (if needed) */}
      {collectEmail && (
        <div className="space-y-2">
          <label className="font-medium">Your Email</label>
          <input
            type="email"
            className="border p-2 rounded w-full"
            value={answers["email"] || ""}
            onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
            placeholder="your@email.com"
          />
        </div>
      )}

      {/* Form Fields */}
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
