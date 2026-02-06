import { NextResponse } from "next/server";
import  connectDB  from "@/lib/db";
import Form from "@/models/Form";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {name,fields} = body

    if(!name || !fields || fields.length === 0){
      return NextResponse.json(
        {success:false,message:"Form name and fields are required"},
        {status:400}
      )
    }

    const form = await Form.create({
      name,
      fields: body.fields,
    });

    

    return NextResponse.json(
      { success: true, data: form },
      { status: 201 }
    );
  } catch (error) {
    console.log("SAVE FORM ERROR",error)
    return NextResponse.json(
      { success: false, message:"Failed to save form"},
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    await connectDB();

    const forms = await Form.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: forms,
    });
  } catch (error) {
    console.error("GET FORMS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}

//*PUT API*/

// export async function PUT(req, context) {
//   try {
//     await connectDB();

//     const { id } = await context.params;
//     const body = await req.json();

//     const updatedForm = await Form.findByIdAndUpdate(
//       id,
//       body,
//       { new: true }
//     );

//     return NextResponse.json({
//       success: true,
//       data: updatedForm,
//     });
//   } catch (error) {
//     console.error("UPDATE FORM ERROR:", error);
//     return NextResponse.json(
//       { success: false, error: "Update failed" },
//       { status: 500 }
//     );
//   }
// }