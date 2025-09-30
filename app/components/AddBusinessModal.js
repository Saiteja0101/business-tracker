// app/components/BusinessFormModal.js
"use client";
import { X } from "lucide-react";

export default function AddBusinessModal({ isOpen, onClose, businessName, initialInvestment, trackDays, startDate, onSubmit, onChange }) {
  if (!isOpen) return null;

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
          Add New Business
        </h2>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              placeholder="Enter business name"
              name="businessName"
              value={businessName}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Investment
            </label>
            <input
              type="number"
              min={0}
              placeholder="₹ Enter amount"
              name="initialInvestment"
              value={initialInvestment}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Track for (Days)
            </label>
            <input
              type="number"
              placeholder="e.g. 30"
              name="trackDays"
              value={trackDays}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
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
    </div >
  );
}
