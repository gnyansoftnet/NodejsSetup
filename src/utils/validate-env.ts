export const validateEnv = (): void => {

    const required: string[] = [
        "NODE_ENV",
        "PORT",

        "DB_HOST",
        "DB_PORT",
        "DB_USERNAME",
        "DB_PASSWORD",
        "DB_DATABASE",

        "ACCESS_SECRET",
        "REFRESH_SECRET",
        "ACCESS_EXPIRES",
        "REFRESH_EXPIRES",


        "ALLOWED_ORIGINS",

        "RUN_SEED",
        "SEED_ORG_NAME",
        "SEED_ORG_SHORT",
        "SEED_ORG_CODE",
        "SEED_ORG_ADDRESS",
        "SEED_BRANCH_NAME",
        "SEED_BRANCH_SHORT",
        "SEED_BRANCH_CODE",
        "SEED_ROLE_NAME",
        "SEED_ADMIN_NAME",
        "SEED_ADMIN_CODE",
        "SEED_ADMIN_FULLNAME",
        "SEED_ADMIN_EMAIL",
        "SEED_ADMIN_PASSWORD",
    ];

    // ✅ Find all missing vars at once
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `❌ Missing required environment variables:\n${missing
                .map(k => `   - ${k}`)
                .join("\n")}`
        );
    }


    if (isNaN(Number(process.env.DB_PORT))) {
        throw new Error("❌ DB_PORT must be a valid number");
    }

    if (isNaN(Number(process.env.PORT))) {
        throw new Error("❌ PORT must be a valid number");
    }

    const validEnvs = ["development", "production", "test"];
    if (!validEnvs.includes(process.env.NODE_ENV!)) {
        throw new Error(
            `❌ NODE_ENV must be one of: ${validEnvs.join(", ")}`
        );
    }

    // DB_SSL must be boolean string
    if (process.env.DB_SSL && !["true", "false"].includes(process.env.DB_SSL)) {
        throw new Error("❌ DB_SSL must be 'true' or 'false'");
    }

    // RUN_SEED must be boolean string
    if (!["true", "false"].includes(process.env.RUN_SEED!)) {
        throw new Error("❌ RUN_SEED must be 'true' or 'false'");
    }

    // ALLOWED_ORIGINS must have at least one origin
    const origins = process.env.ALLOWED_ORIGINS!.split(",").filter(Boolean);
    if (origins.length === 0) {
        throw new Error("❌ ALLOWED_ORIGINS must have at least one origin");
    }

    // if (process.env.NODE_ENV === "production") {

    //     // Strong admin password
    //     if (process.env.SEED_ADMIN_PASSWORD!.length < 4) {
    //         throw new Error(
    //             "❌ SEED_ADMIN_PASSWORD must be at least 12 characters in production"
    //         );
    //     }

    //     // Strong JWT secrets
    //     if (process.env.ACCESS_SECRET!.length < 32) {
    //         throw new Error(
    //             "❌ ACCESS_SECRET must be at least 32 characters in production"
    //         );
    //     }

    //     if (process.env.REFRESH_SECRET!.length < 32) {
    //         throw new Error(
    //             "❌ REFRESH_SECRET must be at least 32 characters in production"
    //         );
    //     }

    //     // SSL should be enabled in production
    //     if (process.env.DB_SSL === "false") {
    //         console.warn(
    //             "⚠️  Warning: DB_SSL is false in production. Consider enabling SSL."
    //         );
    //     }
    // }

    console.log("✅ Environment variables validated successfully");
};