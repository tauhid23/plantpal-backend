import { Sequelize } from "sequelize";
import { env } from "./env";

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",
  logging: env.NODE_ENV === "development" ? console.log : false,
});

export async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
}
