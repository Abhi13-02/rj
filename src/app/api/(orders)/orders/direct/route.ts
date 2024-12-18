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
    const { userId, items, shippingAddress, paymentMethod } = body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Products.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Product ${item.productId} is out of stock` },
          { status: 400 }
        );
      }

      orderItems.push({
        productId: product._id,
        name: product.title,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });

      totalAmount += product.price * item.quantity;
    }

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
    for (const item of items) {
      await Products.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Add order reference to the user
    await User.findByIdAndUpdate(userId, { $push: { yourOrders: order._id } });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating direct order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}