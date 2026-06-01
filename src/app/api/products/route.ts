import { NextRequest, NextResponse } from "next/server";
import { initDb, getProducts } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    initDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    
    const products = getProducts(category);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}