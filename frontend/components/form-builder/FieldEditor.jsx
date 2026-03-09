"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * FieldEditor
 * - Edits ONE field
 * - If field has options, each option can have nested fields
 * - Recursive component
 */
export default function FieldEditor({ field, onUpdate, onDelete }) {
  // update any key of field
  const  updateField = (key, value) => {
    onUpdate({
      ...field,
      [key]: value,
    });
  };

  /* ---------------- OPTIONS LOGIC ---------------- */

  const addOption = () => {
    updateField("options", [
      ...(field.options || []),
      {
        label: "",
        children: [],
      },
    ]);
  };

  const updateOptionLabel = (index, value) => {
    const updated = [...field.options];
    updated[index].label = value;
    updateField("options", updated);
  };

  const addNestedField = (optionIndex) => {
    const updated = [...field.options];
    updated[optionIndex].children.push({
      id: Date.now(),
      label: "",
      type: "text",
      required: false,
      options: [],
    });
    updateField("options", updated);
  };

  const updateNestedField = (optionIndex, childIndex, updatedChild) => {
    const updated = [...field.options];
    updated[optionIndex].children[childIndex] = updatedChild;
    updateField("options", updated);
  };

  const deleteNestedField = (optionIndex, childId) => {
    const updated = [...field.options];
    updated[optionIndex].children = updated[optionIndex].children.filter(
      (c) => c.id !== childId
    );
    updateField("options", updated);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="border rounded-md p-4 space-y-4">
      {/* Field Label */}
      <Input
        placeholder="Field label"
        value={field.label ||""}
        onChange={(e) => updateField("label", e.target.value)}
      />

      {/* Field Type */}
      <Select
        value={field.type}
        onValueChange={(value) => updateField("type", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select field type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Text (Single Line)</SelectItem>
          <SelectItem value="textarea">Text Area (Multi Line)</SelectItem>
          <SelectItem value="radio">Radio Button</SelectItem>
          <SelectItem value="checkbox">Checkbox</SelectItem>
          <SelectItem value="select">Dropdown</SelectItem>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="file">File Upload</SelectItem>
          <SelectItem value="image">Image Upload</SelectItem>
          <SelectItem value="pdf">PDF Upload</SelectItem>
          <SelectItem value="video">Video Upload</SelectItem>
        </SelectContent>
      </Select>

      {/* Placeholder Field */}
      {["text", "textarea", "email", "number"].includes(field.type) && (
        <Input
          placeholder="Field placeholder"
          value={field.placeholder || ""}
          onChange={(e) => updateField("placeholder", e.target.value)}
        />
      )}

      {/* Default Value Field */}
      {["text", "textarea"].includes(field.type) && (
        <Input
          placeholder="Default value"
          value={field.defaultValue || ""}
          onChange={(e) => updateField("defaultValue", e.target.value)}
        />
      )}

      {/* Validation Rules */}
      {["text"].includes(field.type) && (
        <div className="border rounded p-2 space-y-2">
          <p className="text-xs font-medium">Validation (optional):</p>
          <Input
            placeholder="Min length"
            type="number"
            value={field.validation?.minLength || ""}
            onChange={(e) => updateField("validation", {
              ...field.validation,
              minLength: e.target.value ? parseInt(e.target.value) : undefined
            })}
            className="text-xs"
          />
          <Input
            placeholder="Max length"
            type="number"
            value={field.validation?.maxLength || ""}
            onChange={(e) => updateField("validation", {
              ...field.validation,
              maxLength: e.target.value ? parseInt(e.target.value) : undefined
            })}
            className="text-xs"
          />
        </div>
      )}

      {/* Required */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={field.required}
          onCheckedChange={(val) => updateField("required", val)}
        />
        <span className="text-sm">Required</span>
      </div>

      {/* OPTIONS (radio / checkbox / dropdown only) */}
      {["radio", "checkbox", "select"].includes(field.type) && (
        <div className="space-y-4">
          <p className="font-medium text-sm">Options</p>

          {field.options?.map((opt, optIndex) => (
            <div
              key={optIndex}
              className="border rounded-md p-3 space-y-3"
            >
              {/* Option Label */}
              <Input
                placeholder="Option label"
                value={opt.label ||""}
                onChange={(e) =>
                  updateOptionLabel(optIndex, e.target.value)
                }
              />

              {/* Add Nested Field Button */}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addNestedField(optIndex)}
              >
                + Add Nested Field
              </Button>

              {/* Nested Fields */}
              <div className="ml-4 border-l pl-4 space-y-3">
                {opt.children.map((child, childIndex) => (
                  <FieldEditor
                    key={child.id}
                    field={child}
                    onUpdate={(updatedChild) =>
                      updateNestedField(
                        optIndex,
                        childIndex,
                        updatedChild
                      )
                    }
                    onDelete={() =>
                      deleteNestedField(optIndex, child.id)
                    }
                  />
                ))}
              </div>
            </div>
          ))}

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={addOption}
          >
            + Add Option
          </Button>
        </div>
      )}

      {/* Delete Field */}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onDelete}
      >
        Delete Field
      </Button>
    </div>
  );
}
// Field → Options → Children → Nested FieldEditor  easy understand flow