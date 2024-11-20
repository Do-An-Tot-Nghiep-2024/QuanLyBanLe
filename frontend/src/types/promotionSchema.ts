import { z } from "zod";

export const PromotionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Tên khuyến mãi là bắt buộc" }),
  description: z.string().min(1, { message: "Mô tả khuyến mãi là bắt buộc" }),
  startDate: z
    .string()
    .min(1, { message: "Ngày bắt đầu là bắt buộc" })
    .refine(
      (value) => {
        const date = new Date(value);
        const now = new Date();
        const diff = now.getFullYear() - date.getFullYear();
        return diff >= 0;
      },
      { message: "Ngày bắt đầu phải lớn hơn ngày hiện tại" }
    ),
  endDate: z
    .string()
    .min(1, { message: "Ngày kết thúc là bắt buộc" })
    .refine(
      (value) => {
        const date = new Date(value);
        const now = new Date();
        const diff = now.getFullYear() - date.getFullYear();
        return diff >= 0;
      },
      { message: "Ngày kết thúc phải lớn hơn ngày bắt đầu" }
    ),

  orderLimit: z.preprocess(
    (val) => parseInt(z.string().parse(val)),
    z.number().min(1, { message: "Số lượng đơn hàng tối thiểu phải lớn hơn 0" })
  ),
  minOrderValue: z.preprocess(
    (val) => parseInt(z.string().parse(val)),
    z.number().min(1, { message: "Giá trị đơn hàng tối thiểu phải lớn hơn 0" })
  ),

  discountPercent: z.preprocess(
    (val) => parseInt(z.string().parse(val)),
    // value is between 0 and 100
    z
      .number()
      .min(0, { message: "Phần trăm giảm giá phải trong khoảng 0 đến 100" })
      .max(100, { message: "Phần trăm giảm giá phải trong khoảng 0 đến 100" })
  ),
});
export type PromotionSchema = z.infer<typeof PromotionSchema>;

export const defaultPromotionSchema: PromotionSchema = {
  id: 0,
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  orderLimit: 0,
  minOrderValue: 0,
  discountPercent: 0,
};
