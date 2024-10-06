import { z } from "zod";

export const EmployeeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Tên nhân viên là bắt buộc" }),
  email: z
    .string()
    .min(1, { message: "Email là bắt buộc" })
    .refine((value) => /.+@.+/.test(value), { message: "Email không hợp lệ" }),
  phone: z
    .string()
    .min(1, { message: "Số điện thoại là bắt buộc" })
    .max(10, { message: "Số điện thoại không hơn 10 chữ" }),
  // set dob is older than 18 years old and not empty
  dob: z
    .string()
    .min(1, { message: "Ngày sinh là bắt buộc" })
    .refine(
      (value) => {
        const dob = new Date(value);
        const now = new Date();
        const diff = now.getFullYear() - dob.getFullYear();
        return diff >= 18;
      },
      { message: "Nhân viên phải trên 18 tuổi" }
    )
    // format date to dd/mm/yyyy
    .transform((value) => {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`
    }),
});

export type EmployeeSchema = z.infer<typeof EmployeeSchema>;

export const defaultEmployeeSchema: EmployeeSchema = {
  id: 0,
  name: "",
  email: "",
  phone: "",
  dob: "",
};
