import {
  Alert,
  Button,
  Container,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultEmployeeSchema,
  EmployeeSchema,
} from "../../types/employeeSchema";
import { createEmployeeService } from "../../services/employee.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function CreateEmployee() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeSchema>({
    mode: "all",
    resolver: zodResolver(EmployeeSchema),
    defaultValues: defaultEmployeeSchema,
  });

  const onSubmit: SubmitHandler<EmployeeSchema> = async (data) => {
    try {
      const response = await createEmployeeService(data);
      if (response.message == "success") {
        console.log("Create employee success");
        navigate("/employees", {
          state: { createdSuccess: "Thêm mới nhân viên thành công" },
        });
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // create a pretty form with mui with fields: name, phone, email, dob
    <Container component={"form"} onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h4" align="center" padding={"5px"}>
        Thêm mới nhân viên
      </Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <FormControl fullWidth>
          <FormLabel
            htmlFor="name"
            sx={{
              textAlign: "left",
            }}
          >
            Tên nhân viên:
          </FormLabel>
          <TextField
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            name="name"
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel
            htmlFor="phone"
            sx={{
              textAlign: "left",
            }}
          >
            Số điện thoại:
          </FormLabel>
          <TextField
            {...register("phone")}
            name="phone"
            variant="outlined"
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={2} mb={2}>
        <FormControl fullWidth>
          <FormLabel
            htmlFor="email"
            sx={{
              textAlign: "left",
            }}
          >
            Email:
          </FormLabel>
          <TextField
            {...register("email")}
            name="email"
            variant="outlined"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel
            htmlFor="dob"
            sx={{
              textAlign: "left",
            }}
          >
            Ngày sinh:
          </FormLabel>
          <TextField
            {...register("dob")}
            error={!!errors.dob}
            helperText={errors.dob?.message}
            name="dob"
            variant="outlined"
            type="date"
          />
        </FormControl>
      </Stack>
      <Button type="submit" variant="contained" fullWidth color="success">
        Thêm mới
      </Button>
    </Container>
  );
}
