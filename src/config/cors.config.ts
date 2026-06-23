import { CorsOptions } from 'cors';

const ENV = process.env.NODE_ENV ?? 'development';
const IS_PROD = ENV === 'production';


const ALLOWED_ORIGINS: string[] = IS_PROD
    ? (process.env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean)
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:4200',
        'http://127.0.0.1:3000',
    ];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(
                new Error(
                    `CORS policy: origin "${origin}" is not allowed. ` +
                    `Add it to ALLOWED_ORIGINS in your environment.`
                )
            );
        }
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-Request-ID',
        'Accept',
        'Accept-Language',
    ],

    exposedHeaders: [
        'X-Request-ID',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
    ],


    credentials: true,

    maxAge: 3600,

    preflightContinue: false,

    optionsSuccessStatus: 204,
};

export { ALLOWED_ORIGINS, IS_PROD, ENV };