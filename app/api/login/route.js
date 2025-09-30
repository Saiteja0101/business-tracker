import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {login, password} = body

    if (!login || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const result = await db.query(
      `SELECT * FROM users WHERE email = $1 OR "phoneNo" = $1`,
      [login]
    );

    const user = result.rows[0];    

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user.user_id, email: user.email });

    //  Set cookie
    const response = NextResponse.json({ message: "Login successful", data: user });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/"
    });

    return response;
  } catch (err) {
    return NextResponse.json({ message: "Login failed", error: err.message }, { status: 500 });
  }
}
