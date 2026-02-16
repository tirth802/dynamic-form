"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function EditResponsePage(){
    const{formId,responseId}=useParams()
    const router = useRouter()

    const[answers,setAnswers]=useState([])
    const [loading,setLoading]=useState(true)
    const[fieldMap,setFieldMap]=useState({})

    //! Fetch form details for field labels
    useEffect(()=>{
        if(!formId) return

        fetch(`/api/forms/${formId}`)
        .then((res)=>res.json())
        .then((data)=>{
            if(data.success){
                const map = {}
                data.data.fields.forEach((field)=>{
                    map[field._id]=field.label
                })
                setFieldMap(map)
            }
        })
        .catch(()=>toast.error("Error fetching form details"))
        },[formId])
    //? Fetch exist Response

    useEffect(()=>{
        if(!responseId) return

        fetch(`/api/form-responses/${responseId}`)
        .then((res)=>res.json())
        .then((data)=>{
            if(data.success){
                setAnswers(data.data.answers)
            }else{
                toast.error("Response not found")
            }
        })
        .catch(()=>toast.error("Error fetching response"))
        .finally(()=>setLoading(false));
    },[responseId])

     //? Update response
     const  handleUpdate=async()=>{
        try {
            const res = await fetch(`/api/form-responses/${responseId}`,{
                method:"PUT",
                headers:{ "Content-Type":"application/json"},
                body:JSON.stringify({answers})
            })
            const data = await res.json()
            if(data.success){
                toast.success("Response updated successfully")
                router.push(`/forms/${formId}/responses`)
            }else{
                toast.error("Failed to update response")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error updating response")
        }
     }

     if(loading) return <p>Loading...</p>

     return(
        <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Response</h1>

      {/* Render editable fields */}
      {Object.entries(answers).map(([fieldId, value]) => (
        <div key={fieldId} className="space-y-2">
          <label className="text-sm font-medium">{fieldMap[fieldId] || fieldId}</label>
          <Input
            type="text"
            value={Array.isArray(value) ? value.join(", ") : value}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [fieldId]: e.target.value,
              }))
            }
          />
        </div>
      ))}

      <Button className="w-full" onClick={handleUpdate}>
        Save Changes
      </Button>
    </div>

     )
}