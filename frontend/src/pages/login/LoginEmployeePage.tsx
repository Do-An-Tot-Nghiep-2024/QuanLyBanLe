import {
  Box,
  Typography,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SubmitHandler, useForm } from "react-hook-form";
import { defaultLoginSchema, LoginSchema } from "../../types/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppDispatch } from "../../redux/hook";
import { getAccount } from "../../redux/auth/authSlice";
import colors from "../../constants/color";
import MessageAlert from "../../components/MessageAlert";
export default function LoginEmployeePage() {
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  // event handlers
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
    formState: { errors },
  } = useForm<LoginSchema>({
    mode: "all",
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultLoginSchema,
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      const response = await loginService(data);
      console.log(response);
      if (response?.message === "success") {
        console.log("Login success");
        const { accessToken } = response.data as { accessToken: string };
        Cookies.set("accessToken", accessToken);
        dispatch(getAccount());
        navigation("/");
      } else {
        setMessage("Tên đăng nhập hoặc mật khẩu không đúng");
        setOpen(true);
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      {message && (
        <MessageAlert open={open} setOpen={setOpen} message={message} />
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 6, sm: 12 }}>
          <Typography
            color="white"
            align="center"
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginTop: "20px",
              fontStyle: "italic",
            }}
          >
            WELCOME
          </Typography>
          <Stack
            onSubmit={handleSubmit(onSubmit)}
            component="form"
            spacing={2}
            sx={{
              width: "500px",
              marginTop: "100px",
              marginLeft: "250px",
              marginRight: "auto",
              backgroundColor: "#ffffff",
              padding: "50px",
              height: "70%",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
              borderRadius: "10px",
              textAlign: "center",
            }}
            alignItems="center"
          >
            <Typography
              variant="h5"
              color="black"
              sx={{ marginBottom: "20px" }}
            >
              ĐĂNG NHẬP
            </Typography>

            <TextField
              {...register("username")}
              label="Tài khoản"
              variant="outlined"
              sx={{ width: "300px", color: "white" }}
              type="text"
              name="username"
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <FormControl sx={{ m: 1, width: "300px" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password" color="error">
                Password
              </InputLabel>
              <OutlinedInput
                {...register("password")}
                error={!!errors.password}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                name="password"
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
                label="Mật khẩu"
              />
              <FormHelperText error>{errors.password?.message}</FormHelperText>
            </FormControl>

            <Button
              sx={{
                width: "300px",
                fontWeight: "bold",
                background: colors.accentColor,
              }}
              variant="contained"
              type="submit"
            >
              ĐĂNG NHẬP
            </Button>
          </Stack>
        </Grid>
        <Grid size={{ xs: 6, md: 6, sm: 12 }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%", marginTop: "50px" }}
          >
            <Box
              component="img"
              alt="Logo Login"
              sx={{
                height: 416,
                width: 500,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              src="https://res.cloudinary.com/dujylxkra/image/upload/e_background_removal/f_png/v1725956899/login_gy9ckn.jpg"
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
