import { Sequelize } from "sequelize";
import { env } from "./env";

export const sequelize = new Sequelize(
  env.DB_NAME,        
  env.DB_USER,        
  env.DB_PASS, 
{       
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    dialect: "postgres",
    logging: env.NODE_ENV === "development" ? console.log : false,
  }
);
