const express = require("express");
const connectDB = require("./config/db");

// Connect to Database
connectDB();

// Route files
const users = require("./routes/user.routes");

const app = express();

// req body parser
app.use(express.json());

// Mount routers
app.use("/api/v1/users", users);

const PORT = 5000;

const server = app.listen(
    PORT,
    console.log(
      `Server running on port ${PORT}`
    )
  );
  
  // handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });