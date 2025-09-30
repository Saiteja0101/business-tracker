"use client";
import { X } from "lucide-react";
import { useState } from "react";

export default function RemoveBusinessModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    businessName: "",
    profilePassword: ""
  })
  if (!isOpen) return null;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/remove-business", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.error);
      return alert(data.message || "Failed to remove business");
    }

    alert("Business removed successfully");
    onClose(); // close modal after success
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};


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
          Remove Business
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              type="text"
              placeholder="Enter business name"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Password
            </label>
            <input
              name="profilePassword"
              value={formData.profilePassword}
              onChange={handleChange}
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black border-2 border-black text-gray-50 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 hover:text-black transition duration-300"
          >
            Remove Business
          </button>
        </form>
      </div>
    </div>
  );
}
