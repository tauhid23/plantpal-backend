export interface TComment {
  id: number;
  content: string;
  userId: number;
  plantId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TCommentCreateInput {
  content: string;
  userId: number;
  plantId: number;
}
