import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import { TComment, TCommentCreateInput } from "../types/comments";

export const Comment = sequelize.define<Model<TComment, TCommentCreateInput>>(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    plantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "plant_id",
      references: {
        model: "plants",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "comments",
    timestamps: true,
    underscored: true,
  }
);
