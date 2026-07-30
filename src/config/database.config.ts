import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envPath = path.join(__dirname, "../../.env");

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`✅ Loaded env file: ${envPath}`);
} else {
    console.warn(`⚠️ No .env file found at ${envPath} — relying on system environment variables`);
}

const requiredEnvVars = ["DB_HOST", "DB_PORT", "DB_USERNAME", "DB_PASSWORD", "DB_DATABASE"];
for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
}

const isProduction = process.env.NODE_ENV === "production";

const baseConfig: DataSourceOptions = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [path.join(__dirname, "../entities/*.{ts,js}")],
    migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
    synchronize: false,
    // subscribers: [path.join(__dirname, "../subscribers", isProduction ? "*.js" : "*.ts")],
    connectTimeout: 10000,
    // migrationsRun: true,
};

const devConfig: DataSourceOptions = {
    ...baseConfig,
    logging: true,
    extra: { connectionLimit: 5 },

};

const prodConfig: DataSourceOptions = {
    ...baseConfig,
    logging: ["error", "warn"],
    extra: { connectionLimit: 20 },
    ...(process.env.DB_SSL === "true" && {
        ssl: { rejectUnauthorized: true }
    }),
};

export const AppDataSource = new DataSource(
    isProduction ? prodConfig : devConfig
);