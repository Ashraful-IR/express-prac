import "dotenv/config";
import app from "./app.js";
import pool from "./config/dbconfig.js";
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await pool.query("SELECT 1");

    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database");
    console.error(error.message);
  }
}

startServer();
