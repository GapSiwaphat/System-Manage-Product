import express from "express";
import cors from "cors";

// Import routes
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import locationRoutes from "./routes/location.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use('/api/users', userRoutes);
app.use("/orders", orderRoutes);
app.use("/location", locationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});