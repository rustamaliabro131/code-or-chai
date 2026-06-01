import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { initDb, getUserById } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shopease-secret-key-2024";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    initDb();
    const user = getUserById(decoded.userId) as any;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: Boolean(user.isAdmin),
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}