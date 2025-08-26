import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import { TUser, TUserCreateInput } from "../types/user";

export const User = sequelize.define<Model<TUser, TUserCreateInput>>(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);
