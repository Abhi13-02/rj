import { NextRequest, NextResponse } from 'next/server';
import Cart, { CartItem } from '@/models/Cart';
import User from '@/models/User';
import Order, { OrderItem } from '@/models/Orders';
import Products from '@/models/Products';
import dbConnect from '@/libs/dbConnect';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, shippingAddress, paymentMethod, shiprocketOrderId, status, items, totalAmount } = body;

    // Find the user's cart
    const userCart = await Cart.findOne({ userId }).populate('items.productId');

    if(!paymentMethod) {
      return NextResponse.json({ error: ' payment method are required' }, { status: 400 });
    }

   // Validate stock for each item
   let messages = [];
    for (const item of userCart.items) {
    const productSizes = item.productId.sizes as { size: string; stock: number }[];
    if (item.quantity > productSizes.filter((size ) => size.size === item.size)[0].stock) {
      messages.push(
        `Insufficient stock for ${item.productId.title}. Available: ${productSizes.filter((size ) => size.size === item.size)[0].stock}, Requested: ${item.quantity}`
      );
     }
    }

  // If there are any stock issues, return the messages
  if (messages.length > 0) {
    return NextResponse.json(
      { error: 'Insufficient stock for some items', details: messages },
      { status: 202 }
    );
  }

    // Create the order
    const order = await Order.create({
      userId,
      items: items,
      totalAmount,
      shippingAddress,
      shiprocketOrderId,
      paymentMethod,
      status: status ,
    });

    // Deduct stock for each product
      for (const item of userCart.items) {
        await Products.updateOne(
          { _id: item.productId._id, "sizes.size": item.size }, // Match the product and size
          { $inc: { "sizes.$.stock": -item.quantity } } // Decrement the stock for the matched size
        );
      }

    // // Clear the cart
    // userCart.items = [];
    // userCart.totalAmount = 0;
    // await userCart.save();

    // Add order reference to the user
    await User.findByIdAndUpdate(userId, { $push: { yourOrders: order._id } });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating dborder:', error);
    return NextResponse.json({ error: 'Failed to create dbOrder' }, { status: 500 });
  }
}
