import express from "express";
import "./container/container";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { corsErrorHandler, corsMiddleware, handlePreflight } from "./middlewares/cors.middleware";
import { corsLogger } from "./utils/cors-logger";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRoute from "./routes/auth.route";
import organisationRoute from "./routes/organisation.route";
import branchRoute from "./routes/branch.route";
import roleRoute from "./routes/role.route";

const app = express();


app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later." }
}));

app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

if (process.env.NODE_ENV !== "production") {
    app.use(corsLogger);
}

app.options("/{*path}", handlePreflight);
app.use(corsMiddleware);

app.get("/management/health", (_req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        uptime: Math.floor(process.uptime()),
        version: process.env.npm_package_version || "1.0.0"
    });
});

app.use("/api/auth", authRoute);
app.use("/api/organisation", organisationRoute);
app.use("/api/branch", branchRoute);
app.use("/api/Role", roleRoute);

app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});
app.use(corsErrorHandler);
app.use(errorMiddleware);

export default app;