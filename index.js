import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import accountsRoutes from "./src/routes/account.routes.js";
import metricsRoutes from "./src/routes/metrics.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App setup
const app = express();
const server = createServer(app);
export const io = new Server(server, {
  // Export for controllers
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/social-dashboard",
  )
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Routes
app.use("/api/accounts", accountsRoutes);
app.use("/api/metrics", metricsRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    name: "Social Media Dashboard API",
    version: "1.0.0",
    status: " Running",
    endpoints: "/api/accounts, /api/metrics",
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
