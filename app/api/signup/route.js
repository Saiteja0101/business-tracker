import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, phoneNo, password } = body;

        if (!name || !email || !password || !phoneNo) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save to DB (adjust column names!)
        const result = await db.query(
            `INSERT INTO users (name, email, "phoneNo", password) VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, phoneNo, hashedPassword]
        );

        const newUser = result.rows[0]
        const token = signToken({ id: newUser.user_id, email: newUser.email })
        const response = NextResponse.json(
            { 
                message: "Signup successful", 
                data: newUser 
            },
            { status: 201 }
        );

        response.cookies.set("token", token, {
            httpOnly: true, // cannot be accessed by JS
            secure: process.env.NODE_ENV === "production", // only https in prod
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/"
        });
    } catch (err) {
        console.error("Signup Error:", err);
        return NextResponse.json(
            {
                message: "Signup failed",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
