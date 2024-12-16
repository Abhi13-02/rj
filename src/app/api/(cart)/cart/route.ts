import dbConnect from "@/libs/dbConnect";
import Cart from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found for the user" },
        { status: 404 }
      );
    }
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// // POST update the totalAmount of a cart
// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { userId, totalAmount } = body;
//   if (!userId || totalAmount === undefined) {
//     return NextResponse.json(
//       { error: "User ID and totalAmount are required" },
//       { status: 400 }
//     );
//   }
//   try {
//     await dbConnect();
//     const updatedCart = await Cart.findOneAndUpdate(
//       { userId },
//       { totalAmount },
//       { new: true }
//     );
//     if (!updatedCart) {
//       return NextResponse.json(
//         { message: "Cart not found for the user" },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json(updatedCart);
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     return NextResponse.json(
//       { error: "Failed to update cart" },
//       { status: 500 }
//     );
//   }
// }