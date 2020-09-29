const express = require("express");
const connectDB = require("./config/db");
const redis = require("redis");
const axios = require("axios");
const dotenv = require("dotenv");
const app = express();

// Connect to Database
connectDB();

// Route files
const users = require("./routes/user.routes");
const auth = require("./routes/auth.routes");
const post = require("./routes/post.routes");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// req body parser
app.use(express.json());

// Mount routers
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/post", post);

const PORT = process.env.PORT || 5000;
const PORTREDIS = process.env.PORTREDIS || 6379;

const redisClient = redis.createClient(PORTREDIS)

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