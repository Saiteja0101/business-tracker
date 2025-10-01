"use client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function SalesExpensesModal({ isOpen, onClose }) {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");

  // default today’s date
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    sales: "",
    expenses: "",
    date: today,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();
    console.log("Submitted:", formData);
    const payload = { ...formData, businessId: selectedBusiness };
    try {
      const response = await fetch("/api/sales-expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        console.log(data.error);
        alert(data.message || "Failed to Add sales & expenses");
        return;
      }
      return alert("Added sales & expenses");
    } catch (err) {
      console.log(err.message);
      return alert(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetch("/api/businesses")
        .then((res) => res.json())
        .then((data) => setBusinesses(data.businesses));
    }
  }, [isOpen]);

  if (!isOpen) {
    return <></>; // or just return null safely AFTER hooks
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add Sales & Expenses
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Business
            </label>
            <select
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Choose a business</option>
              {businesses.map((b) => (
                <option key={b.business_id} value={b.business_id}>
                  {b.businessname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Today&apos;s Sales
            </label>
            <input
              type="number"
              name="sales"
              value={formData.sales}
              onChange={handleChange}
              min={0}
              placeholder="Enter sales amount"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Today&apos;s Expenses
            </label>
            <input
              type="number"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              min={0}
              placeholder="Enter expenses amount"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black border-2 border-black text-gray-50 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 hover:text-black transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
