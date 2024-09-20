import { LoginSchema } from "../types/loginSchema";
import api from "../config/axios";
import ApiResponse from "../types/apiResponse";
import LoginResponse from "../types/loginResponse";
import axios from "axios";
import Cookies from "js-cookie";
const loginService = async (login: LoginSchema) => {
  try {
    const response: ApiResponse = await api.post("/auth/login", login);
    if (response?.message !== "success") {
      return {
        status: false,
        data: {},
      };
    }
    return {
      status: true,
      data: response.data as LoginResponse,
    };
  } catch (error) {
    console.log(error);
  }
};
const getAccountService = async () => {
  try {
    const response = await axios.get("http://localhost/api/v1/auth/account",{
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
      
    });
    if (response.status !== 200) {
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
