import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, { message: "Tên đăng nhập là bắt buộc" }),
  password: z.string().min(1, { message: "Mật khẩu là bắt buộc" }),
});

export type LoginSchema = z.infer<typeof LoginSchema>;


export const defaultLoginSchema: LoginSchema = {
  username: "",
  password: "",
}