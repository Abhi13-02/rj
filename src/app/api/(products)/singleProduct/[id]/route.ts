import dbConnect from "@/libs/dbConnect";
import Products from "@/models/Products";
import { NextRequest, NextResponse } from "next/server";

// GET a product by ID
export async function GET(req: NextRequest, { params }: any) {
  const { id } =await params;
  try {
    await dbConnect();
    const product = await Products.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT update a product by ID
export async function PUT(req: NextRequest, { params }: any) {
  const { id } =await params;

  try {
    const body = await req.json();
    await dbConnect();
    const updatedProduct = await Products.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE a product by ID
export async function DELETE(req: NextRequest, { params }: any) {
  const { id } =await params;

  try {
    await dbConnect();
    const deletedProduct = await Products.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}