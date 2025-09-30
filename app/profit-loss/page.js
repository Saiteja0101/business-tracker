"use client";
import { ArrowLeft, TrendingUp, TrendingDown, Landmark, TrendingUp as SalesIcon, AlertTriangle, Wallet } from 'lucide-react';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function ProfitLossPage() {

  // Example data (later you can replace with DB/localStorage)
  const [error, setError] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  const businessDataFetch = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/profit-loss", { cache: "no-store" })
      const data = await response.json()

      if (!response.ok) {
        console.log(data.message);
        setError(data.message || "Something went wrong")
        return
      }
      setBusinesses(data.data)
    } catch (err) {
      setError(err.message || "Network error")
    }finally{
      setLoading(false)
    }
  }


  useEffect(() => {
    businessDataFetch()
  }, [])

  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profit / loss data...</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-100 text-red-600 p-4 rounded-lg max-w-md">
          <p className="font-semibold">Error loading data</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={businessDataFetch}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>

          <button
            onClick={() => {router.push('/')}}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors ml-4"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full max-w-6xl mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-700 font-semibold hover:text-gray-900 transition-colors duration-200 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </Link>
      </div>

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Profit / Loss Overview
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Track your business performance with detailed financial insights
        </p>
      </div>

      {/* Business Cards */}
      <div className="w-full max-w-6xl grid gap-8 md:gap-10">
        {businesses.map((biz) => (
          <div
            key={biz.businessId}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Business Header */}
            <div className="bg-gray-900 p-6 text-white">
              <h2 className="text-xl md:text-2xl font-bold">{biz.businessName}</h2>
            </div>

            {/* Financial Data */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Investment */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Landmark className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Investment</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">₹{biz.initialInvestment}</p>
                </div>

                {/* Sales */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <SalesIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Sales</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">₹{biz.totalSales}</p>
                </div>

                {/* Expenses */}
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <div className="flex items-center mb-2">
                    <div className="bg-red-100 p-2 rounded-lg mr-3">
                      <Wallet className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Expenses</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">₹{biz.totalExpenses}</p>
                </div>
              </div>

              {/* Net Profit/Loss */}
              <div className={`mt-6 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between ${biz.profitOrLoss >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center mb-3 sm:mb-0">
                  <span className="font-bold text-gray-800 mr-2">Net {biz.status}:</span>
                  <span className={`text-lg font-semibold ${biz.profitOrLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    ₹{Math.abs(biz.profitOrLoss)}
                  </span>
                </div>
                <div className="flex items-center">
                  {biz.profitOrLoss >= 0 ? (
                    <>
                      <TrendingUp className="text-green-600 mr-2" size={24} />
                      <span className="text-green-600 font-bold">Profit</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="text-red-600 mr-2" size={24} />
                      <span className="text-red-600 font-bold">Loss</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
