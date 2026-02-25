"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

/* ✅ MOVE THIS OUTSIDE COMPONENT */
function buildFieldMap(fields, map = {}) {
  fields.forEach((field) => {
    const key = field._id || field.id;
    map[key] = field.label;

    if (field.options) {
      field.options.forEach((opt) => {
        if (opt.children) {
          buildFieldMap(opt.children, map);
        }
      });
    }
  });

  return map;
}

export default function ResponsesPage() {

  const { formId } = useParams();

  const [responses, setResponses] = useState([]);
  const [fieldMap, setFieldMap] = useState({});
  const [loading, setLoading] = useState(true);
  const[confirmDeleteId,setConfirmDeleteId]=useState(null)

  const handleDelete = async(id)=>{
       try {
              const res= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/form-responses/${id}`,{
                method:"DELETE"
              })
              const data= await res.json()
              if(data.success){
                toast.success("Response deleted successfully")
                setResponses(prev=>prev.filter((r)=>r._id!==id))
              }else{
                toast.error("Failed to delete response")
              }
            } catch (error) {
              console.log(error)
              toast.error("Delete failed")
            }finally{
              setConfirmDeleteId(null)
            }
  }

  useEffect(() => {
    if (!formId) return;

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/form-responses/form/${formId}`).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms/${formId}`).then((r) => r.json()),
    ])
      .then(([responsesRes, formRes]) => {
        if (responsesRes.success) {
          setResponses(responsesRes.data);
        }else{
          toast.error("Error fetching responses")
        } 

        if (formRes.success) {
          const map = buildFieldMap(formRes.data.fields);
          setFieldMap(map);
        }else{
          toast.error("Error fetching form details")
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [formId]); // ✅ dependency is now PERFECT

  if (loading) {
    return <p className="p-6">Loading responses...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Form Responses</h1>

      {responses.length === 0 && (
        <p className="text-gray-500">No responses yet.</p>
      )}

      {responses.map((response, index) => (
        <div
          key={response._id}
          className="border rounded-lg p-4 space-y-3"
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">
              Response #{index + 1}
            </h3>
            <span className="text-xs text-gray-500">
              {new Date(response.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
             {response.answers && Object.keys(response.answers).length > 0 ? (

            Object.entries(response.answers).map(
              ([fieldId, value]) => (
                <div
                  key={fieldId}
                  className="flex justify-between border-b pb-1 text-sm"
                >
                  <span className="text-gray-600">
                    {fieldMap[fieldId] || fieldId}
                  </span>

                  <span className="font-medium">
                    {Array.isArray(value)
                      ? value.join(", ")
                      : value}
                  </span>
                </div>
              )
            )):(<p className="text-gray-400 text-sm">No answers submitted</p>
)}
          </div>
          <Link href={`/forms/${formId}/responses/${response._id}/edit`}> 
          <Button className="ml-2">Edit</Button>
          </Link>
          <Button variant="destructive" className="ml-2"
          onClick={()=>{
           setConfirmDeleteId(response._id) 
          }}>Delete</Button>

           {confirmDeleteId === response._id && (
        <div className="mt-3 p-3 border rounded bg-red-50 space-y-2">
          <p className="text-sm text-red-700">
            Are you sure you want to delete this response? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" 
            onClick={()=>handleDelete(response._id)}>
              Yes, Delete
            </Button>
            <Button size="sm" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

        </div>
        
      ))}
      <Link href={`/`}>
          <Button   className="ml-2">
            
            Back </Button>
          </Link>
    </div>
    
  );
}
