import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import authRouter from "./routes/auth.js";
import superAdminRouter from "./routes/superAdmin.js";
import adminRouter from "./routes/admin.js";
import noticesRouter from "./routes/notices.js";
import profileRouter from "./routes/profile.js";
import chargesRouter from "./routes/charges.js";
import paymentsRouter from "./routes/payments.js";
import complaintsRouter from "./routes/complaints.js";
import errorHandler from "./middleware/errorHandler.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";

const app = express();

// Security and parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically (allow cross-origin access)
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "uploads")),
);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/superadmin", superAdminRouter);
app.use("/api/admin", adminRouter);
app.use("/api/notices", noticesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/charges", chargesRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/complaints", complaintsRouter);
app.use("/api/visitors", visitorRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/staff", staffRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
