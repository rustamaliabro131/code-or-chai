import { NextRequest, NextResponse } from "next/server";
import { initDb, getProductById, updateProduct, deleteProduct } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    initDb();
    const product = getProductById(parseInt(params.id));
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    initDb();
    const data = await request.json();
    const product = updateProduct(parseInt(params.id), data);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    initDb();
    deleteProduct(parseInt(params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}