# 🧾 Business Tracker  

A full-stack web application that helps users **manage multiple businesses**, **track sales and expenses**, and **visualize profit/loss** using interactive charts.  
Built with modern web technologies for smooth performance, security, and scalability.

---

## 🚀 Features  

- 📊 **Profit/Loss Visualization** — Interactive Pie, Bar, and Line charts for financial insights.  
- 💼 **Multi-Business Tracking** — Manage multiple businesses under one account.  
- 💰 **Sales & Expenses Management** — Record daily financial activities.  
- 🔐 **Secure Authentication** — JWT + Cookie-based login and session handling.  
- 🧮 **Automated Calculations** — Real-time profit/loss computation for each business.  
- 🧹 **Remove Business Option** — Easily delete a business securely after password confirmation.  
- 📱 **Responsive Design** — Optimized for desktop, tablet, and mobile.  

---

## 🛠️ Tech Stack  

**Frontend:**  
- Next.js 15  
- React  
- Tailwind CSS  

**Backend:**  
- Next.js API Routes (similar to FastAPI style)  
- Node.js  
- PostgreSQL (via `pg` library)  
- JWT for Authentication  
- bcrypt.js for Password Hashing  

**Visualization:**  
- Recharts (Pie, Bar, and Line charts for analytics)  

---

## ⚙️ Installation  

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saiteja0101/business-tracker.git
   cd business-tracker
2. **Install dependencies**
   ```bash
   npm install
3. **Setup environment variables**
   - Create a .env.local file in the root directory:
     ```bash
     DATABASE_URL=your_postgres_connection_string
      JWT_SECRET=your_secret_key
4. **Run the development server**
   ```bash
   npm run dev
5. **Open http://localhost:3000 in your browser.**
