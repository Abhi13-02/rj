import dbConnect from "@/libs/dbConnect";
import Cart, { CartItem } from "@/models/Cart";
import { NextRequest, NextResponse } from "next/server";


// POST add an item to the cart
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, productId, price, quantity, size, color } = body;

  if (!userId || !productId || !price || !quantity || !size || !color) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    // Check if the product is already in the cart with the same size and color
    const existingItemIndex = cart.items.findIndex(
      (item: CartItem) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex >= 0) {
      // Update the quantity if the item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add a new item if it doesn't exist
      cart.items.push({ productId, price, quantity, size, color });
    }

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0
    );

    const savedCart = await cart.save();
    return NextResponse.json(savedCart, { status: 201 });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// DELETE remove an item from the cart
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { userId, itemId } = body;

  if (!userId || !itemId) {
    return NextResponse.json(
      { error: "User ID and Item ID are required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found for the user" },
        { status: 404 }
      );
    }

    // Remove the item from the cart
    cart.items = cart.items.filter((item: any) => item._id.toString() !== itemId);

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );

    const updatedCart = await cart.save();
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}