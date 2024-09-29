import { z } from "zod";

export const SupplierSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Tên nhà cung cấp là bắt buộc" }),
  email: z
    .string()
    .min(1, { message: "Email là bắt buộc" })
    .refine((value) => /.+@.+/.test(value), { message: "Email không hợp lệ" }),
  phone: z
    .string()
    .min(1, { message: "Số điện thoại là bắt buộc" })
    .max(15, { message: "Số điện thoại không hơn 15 chữ" }), // Adjust max length if necessary
  address: z
    .string()
    .min(1, { message: "Địa chỉ là bắt buộc" }),
});

export type SupplierSchema = z.infer<typeof SupplierSchema>;

export const defaultSupplierSchema: SupplierSchema = {
  id: 0,
  name: "",
  email: "",
  phone: "",
  address: "",
};
