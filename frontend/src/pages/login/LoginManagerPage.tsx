import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import GppGoodIcon from "@mui/icons-material/GppGood";
import PersonIcon from "@mui/icons-material/Person";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { defaultLoginSchema, LoginSchema } from "../../types/loginSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppDispatch } from "../../redux/hook";
import { getAccount } from "../../redux/auth/authSlice";
export default function LoginManagerPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<LoginSchema>({
    mode: "all",
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultLoginSchema,
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      const response = await loginService(data);
      if (response?.status) {
        console.log("Login successfully");
        const { accessToken } = response.data as { accessToken: string };
        Cookies.set("accessToken", accessToken);
        dispatch(getAccount());
        // dispatch(getAccount());
        navigation("/dashboard");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#292C2F",
      }}
    >
      <Stack
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          marginTop: "30px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GppGoodIcon
          sx={{ width: "50px", height: "50px", justifyContent: "center" }}
          color="success"
        ></GppGoodIcon>
        <Typography align="center" sx={{ color: "white", fontSize: "30px" }}>
          TRANG DÀNH CHO QUẢN TRỊ VIÊN
        </Typography>

        <FormControl
          {...register("username")}
          sx={{
            m: 1,
            width: "300px",
            backgroundColor: "#5D5D98",
            borderRadius: "5px",
          }}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-account">
            Tài khoản
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-account"
            name="username"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  <PersonIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Mật khẩu"
          />
        </FormControl>

        <FormControl
          {...register("password")}
          sx={{
            m: 1,
            width: "300px",
            backgroundColor: "#5D5D98",
            borderRadius: "5px",
          }}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password" color="error">
            Mật khẩu
          </InputLabel>
          <OutlinedInput
            name="password"
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <Button
          sx={{
            width: "300px",
            fontWeight: "bold",
            background: "linear-gradient(to right bottom, #579AFF, #345D99)",
            mx: 1,
            my: 2,
            padding: "10px",
          }}
          size="large"
          variant="contained"
          type="submit"
        >
          ĐĂNG NHẬP
        </Button>
      </Stack>
    </Box>
  );
}
