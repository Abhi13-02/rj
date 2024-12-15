import Razorpay from "razorpay";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
// import Order from "@/models/Order";
// import dbConnect from "@/libs/dbConnect";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});


export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

  try {
    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.log("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // // Update order in database
    // await dbConnect();
    // const updatedOrder = await Order.findOneAndUpdate(
    //   { razorpayOrderId: razorpay_order_id },
    //   { paymentStatus: "Paid", paymentId: razorpay_payment_id },
    //   { new: true }
    // );

    // if (!updatedOrder) {
    //   return res.status(404).json({ error: "Order not found" });
    // }

    console.log("verify order",razorpay_payment_id);
    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}