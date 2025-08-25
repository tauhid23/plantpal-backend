export type TActivity = {
  id: number;
  userId: number;
  plantId: number;
  title: string;
  type: "water" | "fertilize" | "insecticide" | "weed" | "custom";
  notes?: string | null;
  dueAt: Date;
  completedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TActivityCreateInput = Omit<
  TActivity,
  "id" | "createdAt" | "updatedAt"
>;
