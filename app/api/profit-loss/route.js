import db from '@/lib/db'
import { verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Login to your account" }, { status: 401 })
    }

    const decode = verifyToken(token)
    const userId = decode.id

    // ✅ get all businesses for this user
    const businessesResult = await db.query(
      `SELECT business_id, businessname, initialinvestment 
       FROM businessdata 
       WHERE user_id = $1`,
      [userId]
    )

    const businesses = businessesResult.rows

    if (businesses.length === 0) {
      return NextResponse.json({ message: "No business found" }, { status: 404 })
    }

    // ✅ loop businesses and calculate totals
    const results = []
    for (const biz of businesses) {
      const salesExpensesResult = await db.query(
        `SELECT 
           COALESCE(SUM(sales), 0) as totalsales,
           COALESCE(SUM(expenses), 0) as totalexpenses
         FROM salesexpenses 
         WHERE business_id = $1`,
        [biz.business_id]
      )

      const { totalsales, totalexpenses } = salesExpensesResult.rows[0]

      const profitOrLoss = Number(totalsales) - Number(totalexpenses) - Number(biz.initialinvestment)
      const status = profitOrLoss >= 0 ? "Profit" : "Loss"

      results.push({
        businessId: biz.business_id,
        businessName: biz.businessname,
        initialInvestment: biz.initialinvestment,
        totalSales: totalsales,
        totalExpenses: totalexpenses,
        profitOrLoss,
        status
      })
    }

    return NextResponse.json({
      message: "Data fetched successfully",
      data: results
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal error" },
      { status: 500 }
    )
  }
}
