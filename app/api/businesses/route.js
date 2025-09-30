import db from '@/lib/db'
import { verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json(
        { message: "Login to your account" },
        { status: 401 }
      )
    }

    const decode = verifyToken(token)
    const userId = decode.id

    // fetch all businesses for the user
    const businesses = await db.query(
      `SELECT business_id, businessname FROM businessdata WHERE user_id = $1`,
      [userId]
    )

    return NextResponse.json(
      { businesses: businesses.rows },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch businesses", error: err.message },
      { status: 500 }
    )
  }
}
