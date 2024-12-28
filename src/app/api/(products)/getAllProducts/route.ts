import dbConnect from "@/libs/dbConnect";
import Products from "@/models/Products";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest){

  try {
   await dbConnect();
   const products = await Products.find();
   return NextResponse.json(products,{status:200});
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
