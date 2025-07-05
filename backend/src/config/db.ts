import mysql from 'mysql2/promise';
import config from './config';

export const pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: "instaclone",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  export async function connectDB() {
    try {
      const connection = await pool.getConnection();
      console.log("✅ MySQL Database connected successfully.");
      connection.release(); // Release the connection back to the pool
    } catch (err) {
      console.error("❌ Database connection failed:", err);
      process.exit(1); // Exit the app if DB fails
    }
  }