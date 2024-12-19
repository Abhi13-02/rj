import { NextRequest, NextResponse } from 'next/server';
import Cart, { CartItem } from '@/models/Cart';
import User from '@/models/User';
import Orders, { OrderItem } from '@/models/Orders';
import Products from '@/models/Products';
import dbConnect from '@/libs/dbConnect';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, shippingAddress, paymentMethod } = body;

    // Find the user's cart
    const userCart = await Cart.findOne({ userId }).populate('items.productId');

    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if(!userId || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: 'User ID, shipping address, and payment method are required' }, { status: 400 });
    }

   // Validate stock for each item

   let messages = [];
    for (const item of userCart.items) {
    if (item.quantity > item.productId.stock) {
      messages.push(
        `Insufficient stock for ${item.productId.title}. Available: ${item.productId.stock}, Requested: ${item.quantity}`
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

    // Prepare order items and calculate the total
    const orderItems = userCart.items.map((item:any) => ({
      productId: item.productId._id,
      name: item.productId.title,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    const totalAmount = userCart.totalAmount;

    // Create the order
    const order = await Orders.create({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
    });

    // Deduct stock for each product
    for (const item of userCart.items) {
      await Products.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear the cart
    userCart.items = [];
    userCart.totalAmount = 0;
    await userCart.save();

    // Add order reference to the user
    await User.findByIdAndUpdate(userId, { $push: { yourOrders: order._id } });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order from cart:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
