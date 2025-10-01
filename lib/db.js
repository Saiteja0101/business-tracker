import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// Create a pool with Neon connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

// Test connection once (during dev only)
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to Neon PostgreSQL");
    client.release();
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  }
};

if (process.env.NODE_ENV !== "production") {
  connectDB();
}

export default pool;
