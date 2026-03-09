"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FieldEditor from "./FieldEditor";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function FormBuilder({onSave, initialTitle, initialFields=[], initialData={}}) {
  const[formName , setFormName]=useState( initialTitle || initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [fields, setFields] = useState( initialFields || initialData?.fields || []);
  const [theme, setTheme] = useState(initialData?.theme || {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    headerImage: ''
  })
  const [settings, setSettings] = useState(initialData?.settings || {
    allowMultipleResponses: false,
    collectEmail: false
  })

  /* ---------------- ADD FIELD ---------------- */

  const addField = (type) => {
    setFields((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: "",
        type,
        required: false,
        placeholder: "",
        defaultValue: "",
        validation: {},
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
    if (fields.length === 0) {
      toast.error("Add at least one field")
      return
    }
  
   // ✅ Pass complete form data with customizations
 onSave({ 
      name: formName, 
      description,
      fields,
      theme,
      settings
    })
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
      {/*Form Description*/}
      <div>
        <Label className="mb-2 text-lg font-medium">Description:</Label>
        <textarea 
          value={description || ""} 
          onChange={(e)=>setDescription(e.target.value)}
          placeholder="Enter form description (optional)"
          className="w-full p-2 border rounded min-h-20 text-sm"
        />
      </div>

      {/*Theme Customization*/}
      <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
        <Label className="text-lg font-medium block">🎨 Customize Theme:</Label>
        
        <div>
          <Label className="text-sm mb-2 block">Background Color:</Label>
          <div className="flex gap-2 items-center">
            <input 
              type="color" 
              value={theme.backgroundColor} 
              onChange={(e)=>setTheme({...theme, backgroundColor: e.target.value})}
              className="h-10 w-20 cursor-pointer border rounded"
            />
            <Input 
              type="text" 
              value={theme.backgroundColor} 
              onChange={(e)=>setTheme({...theme, backgroundColor: e.target.value})}
              placeholder="#ffffff"
              className="flex-1 text-xs"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm mb-2 block">Text Color:</Label>
          <div className="flex gap-2 items-center">
            <input 
              type="color" 
              value={theme.textColor} 
              onChange={(e)=>setTheme({...theme, textColor: e.target.value})}
              className="h-10 w-20 cursor-pointer border rounded"
            />
            <Input 
              type="text" 
              value={theme.textColor} 
              onChange={(e)=>setTheme({...theme, textColor: e.target.value})}
              placeholder="#000000"
              className="flex-1 text-xs"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm mb-2 block">Header Image URL:</Label>
          <Input 
            type="text" 
            value={theme.headerImage || ""} 
            onChange={(e)=>setTheme({...theme, headerImage: e.target.value})}
            placeholder="https://example.com/image.jpg"
            className="text-sm"
          />
        </div>
      </div>

      {/*Form Settings*/}
      <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
        <Label className="text-lg font-medium block">⚙️ Form Settings:</Label>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox"
            checked={settings.allowMultipleResponses}
            onChange={(e)=>setSettings({...settings, allowMultipleResponses: e.target.checked})}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium">Allow multiple responses</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox"
            checked={settings.collectEmail}
            onChange={(e)=>setSettings({...settings, collectEmail: e.target.checked})}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium">Collect respondent email</span>
        </label>
      </div>
      {/* Add Field Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => addField("text")}>
          + Text
        </Button>
        <Button onClick={() => addField("textarea")}>
          + Text Area
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
        <Button onClick={() => addField("date")}>
          + Date
        </Button>
        <Button onClick={() => addField("file")}>
          + File
        </Button>
        <Button onClick={() => addField("image")}>
          + Image
        </Button>
        <Button onClick={() => addField("pdf")}>
          + PDF
        </Button>
        <Button onClick={() => addField("video")}>
          + Video
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
 