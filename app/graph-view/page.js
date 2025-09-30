// app/graph-view/page.js
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#10b981", "#f59e0b"];

export default function GraphViewPage() {
  const [activeChart, setActiveChart] = useState("pie");
  const [isClient, setIsClient] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 400, height: 400 });
  const chartContainerRef = useRef(null);
  const router = useRouter()

  // Fetch business data from backend
  const businessDataFetch = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profit-loss", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setBusinesses(data.data || []);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    // Function to update chart dimensions based on container size
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.clientWidth;
        // For mobile, use a smaller height to prevent overflow
        const height = window.innerWidth < 768 ? 300 : 400;
        setChartDimensions({ width, height });
      }
    };

    // Initial update
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);

    businessDataFetch();
    // Cleanup
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

// Calculate aggregated data for charts
const getAggregatedData = () => {
  if (!businesses.length) return [];

  const aggregated = businesses.reduce((acc, business) => {
    return {
      investment: acc.investment + Number(business.initialInvestment),
      sales: acc.sales + Number(business.totalSales),
      expenses: acc.expenses + Number(business.totalExpenses),
      profit: acc.profit + Math.max(0, business.profitOrLoss),
      loss: acc.loss + Math.abs(Math.min(0, business.profitOrLoss))
    };
  }, { investment: 0, sales: 0, expenses: 0, profit: 0, loss: 0 });

  return [
    { name: "Investment", value: aggregated.investment },
    { name: "Sales", value: aggregated.sales },
    { name: "Expenses", value: aggregated.expenses },
    { name: "Profit", value: aggregated.profit },
    { name: "Loss", value: aggregated.loss },
  ];
};

const chartData = getAggregatedData();

// Calculate total profit/loss across all businesses
const getTotalProfitLoss = () => {
  return businesses.reduce((total, business) => total + business.profitOrLoss, 0);
};

const totalProfitLoss = getTotalProfitLoss();

if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading financial data...</p>
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

if (!businesses.length) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <p className="text-gray-600 mb-4">No business data found</p>
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 flex flex-col items-center">
    <div className="w-full max-w-6xl">
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
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Financial Overview
        </h1>
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${totalProfitLoss >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {totalProfitLoss >= 0 ? (
            <TrendingUp size={20} className="mr-2" />
          ) : (
            <TrendingDown size={20} className="mr-2" />
          )}
          <span className="font-semibold">
            Overall {totalProfitLoss >= 0 ? 'Profit' : 'Loss'}: ₹{Math.abs(totalProfitLoss).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Business Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {businesses.map((business, index) => (
          <div key={business.businessId} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold text-gray-800 mb-2">{business.businessName}</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Investment:</span>
                <span>₹{business.initialInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales:</span>
                <span className="text-green-600">₹{business.totalSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Expenses:</span>
                <span className="text-red-600">₹{business.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                <span>Net {business.status}:</span>
                <span className={business.profitOrLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ₹{Math.abs(business.profitOrLoss).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Selector */}
      <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-6">
        {[
          { key: "pie", label: "Pie Chart" },
          { key: "bar", label: "Bar Chart" },
          { key: "line", label: "Line Chart" }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveChart(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeChart === key
                 ? "bg-black text-white shadow-lg"
                : "bg-white shadow text-gray-700 hover:bg-gray-50"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            className="bg-white p-3 md:p-4 rounded-xl shadow flex flex-col items-center"
            style={{ borderLeft: `4px solid ${COLORS[index]}` }}
          >
            <span className="text-xs md:text-sm font-medium text-gray-500">{item.name}</span>
            <span className="text-sm md:text-base font-bold mt-1">
              ₹{item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Chart Display */}
      <div
        ref={chartContainerRef}
        className="bg-white shadow-xl rounded-2xl p-4 md:p-6 w-full overflow-hidden">
        {isClient ? (
          <div className="flex justify-center items-center w-full overflow-x-auto">
            {activeChart === "pie" && (
              <PieChart width={chartDimensions.width} height={chartDimensions.height}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']}
                />
                <Legend
                  layout={chartDimensions.width < 500 ? "horizontal" : "vertical"}
                  verticalAlign={chartDimensions.width < 500 ? "bottom" : "middle"}
                  align="right"
                />
              </PieChart>
            )}

            {activeChart === "bar" && (
              <BarChart
                width={chartDimensions.width}
                height={chartDimensions.height}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']}
                />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}

            {activeChart === "line" && (
              <LineChart
                width={chartDimensions.width}
                height={chartDimensions.height}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </div>
        ) : (
          <div className="w-full h-96 flex items-center justify-center">
            <div className="text-gray-500">Loading charts...</div>
          </div>
        )}
      </div>

      {/* Info Text */}
      <div className="mt-6 text-center text-sm text-gray-600 max-w-2xl mx-auto">
        <p>Visualizing aggregated financial data across all your businesses. Switch between chart types to analyze your financial performance from different perspectives.</p>
      </div>
    </div>
  </div>
);
}