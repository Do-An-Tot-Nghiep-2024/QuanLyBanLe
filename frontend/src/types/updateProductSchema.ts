import { z } from "zod";

export const UpdateProductSchema = z.object({
  name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc" }),
  categoryId: z.number().min(1, { message: "Danh mục sản phẩm là bắt buộc" }), 
  supplierId: z.number().min(1, { message: "Nhà cung cấp là bắt buộc" }), 
  price: z.number().min(1, { message: "Giá sản phẩm phải lớn hơn 0" }), 
});

export type UpdateProductSchema = z.infer<typeof UpdateProductSchema>;

export const defaultUpdateProductSchema: UpdateProductSchema = {
  name: "",
  categoryId: 0,
  supplierId: 0,
  price: 0, 
};
