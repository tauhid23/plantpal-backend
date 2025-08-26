import { Comment } from "../models";
import { TComment, TCommentCreateInput } from "../types/comments";

export async function listCommentsForPlant(plantId: number) {
  const rows = await Comment.findAll({
    where: { plantId },
    order: [["createdAt", "ASC"]],
  });
  return rows.map((r) => r.get({ plain: true }) as TComment);
}

export async function createComment(input: TCommentCreateInput) {
  const row = await Comment.create(input);
  return row.get({ plain: true }) as TComment;
}

export async function deleteComment(id: number, userId: number) {
  const count = await Comment.destroy({ where: { id, userId } });
  return count > 0;
}
