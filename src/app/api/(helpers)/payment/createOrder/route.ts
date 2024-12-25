import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "", // Add to .env
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json(); // Parse the request body
    const { amount, currency } = body;

    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Amount and currency are required" },
        { status: 400 }
      );
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);

    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
