import { z } from "zod";

export const UnitSchema = z.object({
  name: z.string().min(1, { message: "Tên đơn vị là bắt buộc" })
});

export type UnitSchema = z.infer<typeof UnitSchema>;

export const defaultUnitSchema: UnitSchema = {
  name: "",
};
