// app/components/Navbar.js
"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check auth status from API
    async function checkAuth() {
      try {
        const res = await fetch("/api/me", { cache: "no-store" }); 
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/signout", { method: "POST" }); // API should clear cookie
    setIsLoggedIn(false);
    router.push("/login"); // redirect after logout
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Title */}
          <div className="text-xl font-bold text-gray-800">
            Business Tracker
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex space-x-4">
            {!isLoggedIn ? (
              <button
                onClick={() => router.push("/login")}
                className="bg-black border-2 border-black text-gray-50 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-black transition duration-300"
              >
                Sign in
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-gray-50 border-2 border-black text-black font-semibold px-4 py-2 rounded-lg hover:bg-black hover:text-gray-50 transition duration-300"
              >
                Sign out
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg p-4 space-y-2 grid text-center">
          {!isLoggedIn ? (
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-black border-2 border-black text-gray-50 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-300"
            >
              Sign in
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-gray-50 border-2 border-black text-black px-4 py-2 rounded-lg hover:bg-black hover:text-gray-50 transition duration-300"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
