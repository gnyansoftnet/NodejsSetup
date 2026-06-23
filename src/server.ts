import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`)
});

import app from "./app";
import { AppDataSource } from "./config/database.config";
import { logger } from "./utils/logger";
import { seedAdminUser } from "./seed/admin.seed";
import { validateEnv } from "./utils/validate-env";

const PORT = process.env.PORT || 3000;

process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:", reason);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
});

const startServer = async () => {
    validateEnv();
    try {
        await AppDataSource.initialize();
        logger.info("Database connected ✅");
        if (process.env.NODE_ENV === "development") {
            const migrations = await AppDataSource.runMigrations();
            if (migrations.length > 0) {
                logger.info(`Migrations applied: ${migrations.map(m => m.name).join(", ")}`);
            } else {
                logger.info("No pending migrations");
            }
        }


        if (process.env.NODE_ENV === "development") {
            logger.debug(`DB_HOST: ${process.env.DB_HOST}`);
            logger.debug(`DB_DATABASE: ${process.env.DB_DATABASE}`);
        }

        if (process.env.RUN_SEED === "true") {
            await seedAdminUser();
        }

        const server = app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT} 🚀`);
            logger.info(`Environment: ${process.env.NODE_ENV}`);
        });

        const shutdown = async (signal: string) => {
            logger.info(`${signal} received — shutting down gracefully`);
            server.close(async () => {
                await AppDataSource.destroy();
                logger.info("Database connection closed");
                process.exit(0);
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));

    } catch (error) {
        logger.error("Server startup failed ❌", error);
        process.exit(1);
    }
};

startServer();