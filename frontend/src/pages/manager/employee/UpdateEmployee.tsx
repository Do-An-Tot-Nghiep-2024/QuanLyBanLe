import { useNavigate, useParams } from "react-router-dom";
import {
  getEmployeeByIdService,
  updateEmployeeService,
} from "../../../services/employee.service";
import {
  defaultEmployeeSchema,
  EmployeeSchema,
} from "../../../types/employeeSchema";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
export default function UpdateEmployee() {
  const id = useParams().id || "";
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmployeeSchema>({
    mode: "all",
    resolver: zodResolver(EmployeeSchema),
    defaultValues: defaultEmployeeSchema,
  });
  const handleGetEmployeeById = async (id: number) => {
    try {
      const response = await getEmployeeByIdService(id);
      if (response.message !== "success") {
        throw new Error("Error fetching employee");
      }
      return response.data as EmployeeSchema;
    } catch (error: any) {
      setErrorMessage(error);
    }
  };

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["employee"],
    queryFn: () => handleGetEmployeeById(Number.parseInt(id)), // No need for async/await here
  });

  const onSubmit: SubmitHandler<EmployeeSchema> = async (data) => {
    try {
      const employeeId = Number.parseInt(id);
      console.log(data);
      const response = await updateEmployeeService(employeeId, data);

      if (response.message == "success") {
        console.log("Create employee success");
        navigate("/employees", { state: { updateSuccess: "Cập nhật thông tin nhân viên thành công" } });
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date: string) => {
    const dateArray = date.split("/");
    return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
  };
  useEffect(() => {
    if (data) {
      // setUpdateEmployee(data);
      setValue("name", data?.name ?? " ");
      setValue("phone", data?.phone ?? " ");
      setValue("email", data?.email ?? " ");
      setValue("dob", data.dob !== undefined ? formatDate(data.dob) : "");
    }
  }, [data]);

  return (
    <Container component={"form"} onSubmit={handleSubmit(onSubmit)}>
      {isLoading && isFetching && <p>Loading...</p>}
      {isError && <Alert severity="error">{error.message}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <IconButton onClick={() => navigate("/employees")}>
          <ArrowBackIcon  />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
          }}
        >
          Cập nhật nhân viên  
        </Typography>
      </Stack>
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
        Cập nhật
      </Button>
    </Container>
  );
}
