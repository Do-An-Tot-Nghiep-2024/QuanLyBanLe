import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, { message: "Tên danh mục là bắt buộc" })
});

export type CategorySchema = z.infer<typeof CategorySchema>;

export const defaultCategorySchema: CategorySchema = {
  name: "",
};
