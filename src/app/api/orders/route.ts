import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { initDb, createOrder, getOrdersByUserId, getAllOrders } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shopease-secret-key-2024";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; isAdmin: number };

    initDb();
    
    const orders = decoded.isAdmin ? getAllOrders() : getOrdersByUserId(decoded.userId);
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    initDb();
    const { items, total, shippingAddress } = await request.json();

    if (!items || !items.length) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    const order = createOrder(
      decoded.userId,
      total,
      items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      undefined,
      shippingAddress
    );

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}