import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db, { initDb, getUserByEmail, getUserById } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "shopease-secret-key-2024";

export async function POST(request: NextRequest) {
  try {
    initDb();
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const stmt = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
    const result = stmt.run(email, hashedPassword, name);

    const user = getUserById(result.lastInsertRowid as number) as any;

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: Boolean(user.isAdmin),
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}