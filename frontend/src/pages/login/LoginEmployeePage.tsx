import {
  Box,
  TextField,
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
import MessageAlert from "../../components/MessageAlert";
import image from "../../assets/images/login.png";
import logo from "../../assets/images/logo.png";
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
    <Grid container sx={{ height: "100vh" }}>
      {message && (
        <MessageAlert open={open} setOpen={setOpen} message={message} />
      )}
      {/* Left section */}
      <Grid
        size={{ xs: 12, sm: 6 }}
        sx={{
          backgroundColor: "white",
          p: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
          <Box
            component="img"
            src={logo}
            alt="Login"
            sx={{
              width: 100,
              height: 100,
              objectFit: "cover",
              objectPosition: "left",
              borderRadius: "50%",
            }}
          />
        </Box>

        <Box sx={{ width: 300, mx: "auto" }} component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Email field */}
          <TextField
            {...register("username")}
            name="username"
            label="Tài khoản"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          {/* Password field */}
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password" color={errors.password ? "error" : "primary"}>
              Password
            </InputLabel>
            <OutlinedInput
              {...register("password")}
              error={!!errors.password}
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
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
            <FormHelperText error>{errors.password?.message}</FormHelperText>
          </FormControl>
          {/* Login button */}
          <Button
            variant="contained"
            color="info"
            size="large"
            fullWidth
            type="submit"
            sx={{ mt: 3 }}
          >
            ĐĂNG NHẬP
          </Button>
        </Box>
      </Grid>

      {/* Right section with image */}
      <Grid
        size={{ xs: 12, sm: 6 }}
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        <Box
          component="img"
          src={image}
          alt="Login"
          sx={{
            width: "80%",
            height: "500px",
            objectFit: "cover",
            objectPosition: "left",
          }}
        />
      </Grid>
    </Grid>
  );
}
