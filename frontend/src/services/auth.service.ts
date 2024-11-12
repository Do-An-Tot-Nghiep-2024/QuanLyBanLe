import { LoginSchema } from "../types/loginSchema";
import api from "../config/axios";
import ApiResponse from "../types/apiResponse";
import LoginResponse from "../types/loginResponse";

const loginService = async (login: LoginSchema) => {
  try {
    const response: ApiResponse = await api.post("/auth/login", login);
    console.log(response);

    if (response?.message !== "success") {
      return {
        message: response.message,
        data: {},
      };
    }
    return {
      message: response.message,
      data: response.data as LoginResponse,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: {},
    };
  }
};
const getAccountService = async () => {
  try {
    const response: any = await api.get("/auth/account");
    if (response.message !== "success") {
      return {
        status: false,
        data: {},
      };
    }

    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      data: {},
    };
  }
};

export { loginService, getAccountService };
