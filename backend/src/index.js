import express from "express";
import cors from "cors";
import { compileAPI } from "./api/compile.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/compile", compileAPI);

// Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("Compiler Visualization Backend is running 🚀");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Compiler API running on http://localhost:${PORT}`);
});
