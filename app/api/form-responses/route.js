import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FormResponse from "@/models/FormResponse";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { formId, answers } = body;

    // ✅ VALIDATION (IMPORTANT)
    if (!formId || !answers) {
      return NextResponse.json(
        { success: false, message: "formId and answere is required" },
        { status: 400 }
      );
    }

   

    const response = await FormResponse.create({
      formId,
      answers,
    });

    return NextResponse.json(
      { success: true, data: response },
      { status: 201 }
    );
  } catch (error) {
    console.error("FORM RESPONSE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

//^ GET REQUEST

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const formId = searchParams.get("formId");

    if (!formId) {
      return NextResponse.json(
        { success: false, message: "formId required" },
        { status: 400 }
      );
    }

    const responses = await FormResponse.find({ formId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: responses,
    });
  } catch (err) {
    console.error("GET RESPONSES ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch responses" },
      { status: 500 }
    );
  }
}