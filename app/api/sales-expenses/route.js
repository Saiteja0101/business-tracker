import db from '@/lib/db'
import { verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const body = await request.json()
        const { sales, expenses, date, businessId } = body

        if (!sales || !expenses || !date || !businessId) {
            return NextResponse.json(
                { message: "All fields are mandatory" },
                { status: 400 }
            )
        }

        const token = (await cookies()).get("token")?.value
        if (!token) {
            return NextResponse.json(
                { message: "Login to your account" },
                { status: 401 }
            )
        }
        const decode = verifyToken(token)
        const userId = decode.id

        // Ensure the business belongs to this user
        const checkBusiness = await db.query(
            "SELECT business_id FROM businessdata WHERE user_id = $1 AND business_id = $2",
            [userId, businessId]
        );

        if (checkBusiness.rows.length === 0) {
            return NextResponse.json(
                { message: "Business not found or not owned by this user" },
                { status: 404 }
            );
        }

        // insert sales and expenses
        const result = await db.query(`INSERT INTO salesexpenses (business_id, sales, expenses, record_date) VALUES ($1, $2, $3, $4) RETURNING*`, [businessId, sales, expenses, date])
        return NextResponse.json(
            { message: "Added sales & expenses" },
            { status: 200 }
        )
    } catch (err) {
        return NextResponse.json(
            {
                message: "Failed to Add",
                error: err.message
            },
            { status: 500 }
        )
    }

}