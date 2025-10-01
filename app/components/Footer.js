// app/components/Footer.js
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left - App Info */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-lg font-semibold text-white">Business Tracker</h2>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Right - Social Icons */}
        <div className="flex space-x-6">
          <a 
          href="https://github.com/Saiteja0101" 
          className="hover:text-white">
            <Github size={24} />
          </a>
          <a 
          href="https://x.com/chippa60913?t=P6rk111V1gJhpC7jXd5jwg&s=09" 
          className="hover:text-white">
            <Twitter size={24} />
          </a>
          <a 
          href="https://www.linkedin.com/in/saiteja-chippa-90488a28b/" 
          className="hover:text-white">
            <Linkedin size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
