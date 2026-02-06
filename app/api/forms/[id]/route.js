import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Form from "@/models/Form";

// GET SINGLE FORM
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const form = await Form.findById(id);

    if (!form) {
      return NextResponse.json(
        { success: false, error: "Form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: form });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// UPDATE FORM
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updated = await Form.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 }
    );
  }
}
//*DELETE LOGIC */
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } =  params;

    await Form.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    console.error("DELETE FORM ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}