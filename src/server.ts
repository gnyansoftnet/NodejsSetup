import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.warn(`⚠️ No .env file found at ${envPath}`);
}

import app from "./app";
import { AppDataSource } from "./config/database.config";
import { logger } from "./utils/logger";
import { seedAdminUser } from "./seed/admin.seed";

const PORT = process.env.PORT || 3000;


const startServer = async () => {
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

            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));

    } catch (error) {
        logger.error("Server startup failed ❌", error);

    }
};

startServer();