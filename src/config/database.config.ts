import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`)
});

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
    entities: [path.join(__dirname, "../entities", isProduction ? "*.js" : "*.ts")],
    migrations: [path.join(__dirname, "../migrations", isProduction ? "*.js" : "*.ts")],
    synchronize: false,
    connectTimeout: 10000,
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