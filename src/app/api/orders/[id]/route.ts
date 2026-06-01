import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { initDb, getOrderById, updateOrderStatus } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shopease-secret-key-2024";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; isAdmin: number };

    initDb();
    const order = getOrderById(parseInt(params.id));

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!decoded.isAdmin && order.userId !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { isAdmin: number };

    if (!decoded.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    initDb();
    const { status } = await request.json();
    updateOrderStatus(parseInt(params.id), status);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}