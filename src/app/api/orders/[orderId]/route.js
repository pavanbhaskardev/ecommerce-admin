import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/order";
import { validateAPIRequest } from "@/lib/validateAPIRequest";

export async function GET(req, { params }) {
  try {
    const { userId } = await validateAPIRequest({ headers: req.headers });

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findOne({
      orderId: params.orderId,
      "customer.userId": userId,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { userId } = await validateAPIRequest({ headers: req.headers });

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    await connectDB();

    const body = await req.json();

    // Find the order and ensure it belongs to the user
    const order = await Order.findOne({
      orderId: params.orderId,
      "customer.userId": userId,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow updating certain fields
    const allowedUpdates = ["status", "shipping.tracking"];
    const updates = {};

    for (const field of allowedUpdates) {
      if (body[field]) {
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          if (!updates[parent]) updates[parent] = {};
          updates[parent][child] = body[field];
        } else {
          updates[field] = body[field];
        }
      }
    }

    // Update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: params.orderId },
      { $set: updates },
      { new: true }
    );

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { userId } = await validateAPIRequest({ headers: req.headers });

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    await connectDB();

    // Find the order and ensure it belongs to the user
    const order = await Order.findOne({
      orderId: params.orderId,
      "customer.userId": userId,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Instead of deleting, mark as cancelled
    order.status = "cancelled";
    await order.save();

    return NextResponse.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
