"use client"
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

export default function HeroSection({onStartTracking}) {
  return (
    <section className="bg-gray-100 py-12 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        
        {/* App Name */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Business Tracker
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-6">
          Track multiple businesses in one place. Monitor growth, analyze revenue, 
          and manage expenses with ease.
        </p>

        {/* Tracking Button */}
        <div className="flex justify-center space-x-6">
          <button 
          onClick={onStartTracking}
          className="bg-black text-gray-50 border-2 border-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:text-gray-800 transition duration-300">Start Tracking</button>
        </div>
      </div>
    </section>
  );
}
