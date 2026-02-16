"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FieldEditor from "./FieldEditor";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function FormBuilder({onSave, initialTitle, initialFields=[]}) {
  const[formName , setFormName]=useState( initialTitle||"")
  const [fields, setFields] = useState( initialFields||[]);

  /* ---------------- ADD FIELD ---------------- */

  const addField = (type) => {
    setFields((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: "",
        type,
        required: false,
        options:
          type === "radio" || type === "checkbox" || type === "select"
            ? []
            : [],
      },
    ]);
  };

  /* ---------------- UPDATE FIELD ---------------- */

  const updateField = (index, updatedField) => {
    const updated = [...fields];
    updated[index] = updatedField;
    setFields(updated);
  };

  /* ---------------- DELETE FIELD ---------------- */

  const deleteField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
  };
  
  /* ---------------- SAVE FORM (later API) ---------------- */
  const handleSave = async() => {
    if (!formName){
      toast.error("Form Name is required")
      return
    }
  
   // ✅ Only pass data back
 onSave({ name: formName, fields })
//  onUpdate({ name: formName, fields })
  }
  //   try{
  //     const res = await fetch("/api/forms",{
  //         method:"POST",
  //         headers:{
  //           "content-Type":"application/json"
  //         },
  //         body:JSON.stringify({name:formName,fields})
  //     })
  //     const data = await res.json()
  //     if(data.success){
  //       onSave(data.data)
  //       toast.success("Form saved successfully")
  //     }
  //   }catch(error){
  //     toast.error("Error saving form")
  //   }
    
  //   console.log("FINAL FORM JSON 👇");
  //   console.log(fields);
    
  // };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/*Form Name*/}
      <div>
       <Label className="mb-2 text-2xl font-medium">Form Name:</Label> 
       <Input type="text" value={formName || ""} onChange={(e)=>setFormName(e.target.value)} placeholder="Enter form Name"/>
      </div>
      {/* Add Field Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => addField("text")}>
          + Text
        </Button>
        <Button onClick={() => addField("radio")}>
          + Radio
        </Button>
        <Button onClick={() => addField("checkbox")}>
          + Checkbox
        </Button>
        <Button onClick={() => addField("select")}>
          + Dropdown
        </Button>
      </div>

      {/* Fields Editor */}
      <div className="space-y-4">
        {fields.length === 0 && (
          <p className="text-sm text-gray-500">
            No fields added yet
          </p>
        )}

        {fields.map((field, index) => (
          <FieldEditor
            key={field.id ||field._id||index}
            field={field}
            onUpdate={(updatedField) =>
              updateField(index, updatedField)
            }
            onDelete={() => deleteField(field.id)}
          />
        ))}
      </div>

      {/* Save Button */}
      {fields.length > 0 && (
        <Button
          className="w-full"
          onClick={handleSave}
        >
          Save Form
        </Button>
      )}
    </div>
  );
}
 