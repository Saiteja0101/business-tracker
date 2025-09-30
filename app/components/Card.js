"use client"

export default function BusinessCard({ title, description, icon }) {
  return (
    <div className="bg-gray-900 shadow-md rounded-2xl p-8 w-full max-w-sm hover:shadow-lg hover:scale-[1.05] transition">
      
      {/* Top Row: Icon + Title */}
      <div className="flex items-center space-x-3 mb-3">
        {icon}
        <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
