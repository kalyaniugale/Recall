import express from "express";
import cors from "cors";
import helmet from "helmet";
import memoryRoutes from "./modules/memory/memory.routes.js";
import searchRoutes from "./modules/search/search.routes.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());



// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Recall API is running",
  });
});


app.use("/api/v1/memories", memoryRoutes);
app.use( "/api/v1/search", searchRoutes );
export default app;