import { z } from "zod";

export const SupplierSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Tên nhà cung cấp là bắt buộc" }),
  phone: z
    .string()
    .length(10, { message: "Số điện thoại phải gồm 10 chữ số" }) 
    .regex(/[0-9]/, { message: "Số điện thoại phải là 10 chữ số" }),
  email: z
    .string()
    .min(1, { message: "Email là bắt buộc" })
    .refine((value) => /.+@.+\..+/.test(value), { message: "Email không hợp lệ" }), 
  address: z
    .string()
    .min(1, { message: "Địa chỉ là bắt buộc" }),
});

export type SupplierSchema = z.infer<typeof SupplierSchema>;

export const defaultSupplierSchema: SupplierSchema = {
  id: 0,
  name: "",
  phone: "",
  email: "",
  address: "",
};
