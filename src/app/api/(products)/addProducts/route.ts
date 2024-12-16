import dbConnect from "@/libs/dbConnect";
import Products from "@/models/Products";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      category,
      tags,
      sizes,
      colors,
      stock,
      images,
    } = body;
    const newProduct = await Products.create({
      title,
      description,
      price,
      category,
      tags,
      sizes,
      colors,
      stock,
      images,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        data: newProduct,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
