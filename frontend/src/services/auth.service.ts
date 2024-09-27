import { LoginSchema } from "../types/loginSchema";
import api from "../config/axios";
import ApiResponse from "../types/apiResponse";
import LoginResponse from "../types/loginResponse";
import Cookies from "js-cookie";

const loginService = async (login: LoginSchema) => {
  try {
    const response: ApiResponse = await api.post("/auth/login", login);
    console.log(response);
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
    // const response = await axios.get(
    //   `${import.meta.env.VITE_URL_BE}/auth/account`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     },
    //   }
    // );
    console.log("Token at getAccountService: ", Cookies.get("accessToken"));
    const response: any = await api.get("/auth/account");
    console.log("Get Account Response at auth service: ", response);
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
