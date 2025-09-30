import db from '@/lib/db'
import { verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { businessName, initialInvestment, trackDays, startDate } = body;

        if (!businessName || !initialInvestment || !trackDays || !startDate) {
            return NextResponse.json({ message: 'All fields are mandatory' }, { status: 400 });
        }


        // ✅ get token from cookies
        const token = (await cookies()).get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Login to your account" }, { status: 401 });
        }

        // ✅ verify token and extract user_id
        const decoded = verifyToken(token);
        const userId = decoded.id;

        // check if business already exist 
        const existingBusiness = await db.query(
            `SELECT * FROM businessdata WHERE user_id = $1 AND businessName = $2`,
            [userId, businessName]
        );

        if (existingBusiness.rows.length > 0) {
            return NextResponse.json(
                { message: "Business already exists for this user" },
                { status: 400 }
            );
        }


        // ✅ insert with user_id
        const result = await db.query(
            `INSERT INTO businessdata (user_id, businessName, initialInvestment, trackDays, startDate)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [userId, businessName, initialInvestment, trackDays, startDate]
        );

        return NextResponse.json(
            { message: 'Data inserted successfully', data: result.rows[0] },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            {
                message: `failed to insert`,
                error: err.message
            },
            { status: 500 });
    }
}
