import connectDB from "@/lib/db";
import FormResponse from "@/models/FormResponse";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB();
    const {id}=await params;
    const response = await FormResponse.findById(id);
    if (!response){
        return NextResponse.json(
            {success:false, message:"Response not found"},
            {status:404}
        )
    } 
    return NextResponse.json(
        {success:true, data:response},
        {status:200}
    )

}

//! UPDATE LOGIC
export async function PUT(req, { params }) {
    await connectDB();
    const {id}=await params;
    const body = await req.json();
    const updated = await FormResponse.findByIdAndUpdate(id, body, {new:true});
    return NextResponse.json(
        {success:true, data:updated},
        {status:200}
    )
}

//! DELETE LOGIC
export async function DELETE(req, { params }) {
    await connectDB();
    const {id}=await params;
    await FormResponse.findByIdAndDelete(id);
    return NextResponse.json(
        {success:true, message:"Response deleted"},
        {status:200}
    )
}