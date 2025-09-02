import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ?? 4000,
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5137",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "devsecret",
  // Database configuration
  DB_HOST: process.env.DB_HOST ?? "localhost",
  DB_PORT: process.env.DB_PORT ?? "5432",
  DB_NAME: process.env.DB_NAME ?? "plantpal",
  DB_USER: process.env.DB_USER ?? "postgres",
  DB_PASS: process.env.DB_PASS ?? "tauhid1234",
  CLOUDINARY: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  },
};
