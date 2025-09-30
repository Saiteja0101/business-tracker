import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const {Pool} = pkg
// Create a pool with connection string
const pool = new Pool({
  connectionString: process.env.DB_URI,
  ssl: { rejectUnauthorized: false }

});

// Test connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL");
    // client.release();
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
};

connectDB();

export default pool
