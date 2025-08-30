import { Comment, User } from "../models";
import { TComment, TCommentCreateInput } from "../types/comments";

export async function listCommentsForPlant(plantId: number) {
  const rows = await Comment.findAll({
    where: { plantId },
    order: [["createdAt", "ASC"]],
    include: [{ model: User, as: "user", attributes: ["id", "username"] }],
  });

  return rows.map((r) => {
    const plain = r.get({ plain: true }) as any;
    return plain as TComment & { user?: { id: number; username: string } };
  });
}

export async function createComment(input: TCommentCreateInput) {
  const row = await Comment.create(input);
  const withUser = await Comment.findByPk(row.get("id") as number, {
    include: [{ model: User, as: "user", attributes: ["id", "username"] }],
  });
  return withUser!.get({ plain: true }) as TComment & {
    user?: { id: number; username: string };
  };
}

export async function deleteComment(id: number, userId: number) {
  const count = await Comment.destroy({ where: { id, userId } });
  return count > 0;
}
