"use client";

import { useState } from "react";
import FormBuilder from "@/components/form-builder/FormBuilder";
import FormPreview from "@/components/form-preview/FormPreview";
import { toast } from "sonner";

export default function CreateFormPage() {
  const [schema, setSchema] = useState([]);
  //  console.log("Dataa",schema._id)
     const handleSave = async(newForm) => {
   
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms`,{
          method:"POST",
          headers:{
            "content-Type":"application/json"
          },
          body:JSON.stringify(newForm)
      })
      const data = await res.json()
      if(data.success){
        setSchema(data.data)
        toast.success("Form saved successfully")

        //  Trigger system notification here
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Form created successfully!", {
            body: "Your New form has been Created.",
            icon: "/success-icon.png", // optional
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Form created successfully!", {
                body: "Your New form has been Created.",
                icon: "/success-icon.png",
              });
            }
          });
        }
      }

      }
    }catch(error){
      toast.error("Error saving form")
    }
  }
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <FormBuilder onSave={handleSave}  />
      <FormPreview fields={schema.fields ||[]} formId={schema._id} />
      
    </div>
  );
}
