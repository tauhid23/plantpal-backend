import { User, Plant, Activity } from "../models";
import { sequelize } from "./db";

export async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync({ alter: true });
    console.log("✅ Models synchronized");
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
}
