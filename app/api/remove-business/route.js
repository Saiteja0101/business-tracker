import db from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function DELETE(request) {
  try {
    const body = await request.json(); // ✅ added await
    const { businessName, profilePassword } = body;

    if (!businessName || !profilePassword) {
      return NextResponse.json(
        { message: "All fields are mandatory" },
        { status: 400 }
      );
    }

    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Login to your account" },
        { status: 401 }
      );
    }

    const decode = verifyToken(token);
    const userId = decode.id;

    // Check if business belongs to user
    const businessRes = await db.query(
      `SELECT business_id FROM businessdata WHERE businessName = $1 AND user_id = $2`,
      [businessName, userId]
    );

    if (businessRes.rowCount === 0) {
      return NextResponse.json(
        { message: "Business not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get stored password hash
    const userRes = await db.query(
      `SELECT password FROM users WHERE user_id = $1`,
      [userId]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const hashedPassword = userRes.rows[0].password;

    const validPassword = bcrypt.compareSync(profilePassword, hashedPassword);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Password is incorrect" },
        { status: 403 }
      );
    }

    // Delete business
    await db.query(
      `DELETE FROM businessdata WHERE businessName = $1 AND user_id = $2`,
      [businessName, userId]
    );

    return NextResponse.json(
      { message: "Business removed successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to remove", error: err.message },
      { status: 500 }
    );
  }
}
