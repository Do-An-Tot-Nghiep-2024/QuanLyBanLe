import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc" }),
  categoryId: z.number(
    z.number().min(1, { message: "Danh mục sản phẩm là bắt buộc" }).nullable(),
  ),
  supplierId: z.number(
    z.number().min(1, { message: "Nhà cung cấp là bắt buộc" }).nullable(),
  ),
  unitId: z.number(
    z.number().min(1, { message: "Đơn vị tính là bắt buộc" }).nullable(),
  ),

});

export type ProductSchema = z.infer<typeof ProductSchema>;

export const defaultProductSchema: ProductSchema = {
  name: "",
  categoryId: 0, 
  supplierId: 0, 
  unitId: 0
};
