import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().int().positive({ message: "ID không hợp lệ" }),
  name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc" }),
  image: z.string().url({ message: "Hình ảnh không hợp lệ" }),
  category: z.string().min(1, { message: "Danh mục sản phẩm là bắt buộc" }),
  supplier: z.string().min(1, { message: "Nhà cung cấp là bắt buộc" }),
  originalPrice: z.number().positive({ message: "Giá gốc phải lớn hơn 0" }),
  price: z.number().positive({ message: "Giá sản phẩm phải lớn hơn 0" }),
  discountPrice: z.number().nonnegative({ message: "Giá giảm không thể âm" }).optional(),
});

export type ProductSchema = z.infer<typeof ProductSchema>;

export const defaultProductSchema: ProductSchema = {
  id: 0,
  name: "",
  image: "",
  category: "",
  supplier: "",
  originalPrice: 0,
  price: 0,
  discountPrice: 0,
};
