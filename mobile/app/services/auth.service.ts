import { LoginSchema } from "../types/loginSchema";
import api from "../config/axios";
import ApiResponse from "../types/apiResponse";
import LoginResponse from "../types/loginResponse";
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginService = async (username: string, password: string) => {
  console.log(username, password);
  
  const response = await fetch("http://localhost:8080/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    
  })
  const data = await response.json();
  console.log(data);
  if (data.message !== "success") {
    return {
      status: false,
      data: {},
    };
  }
  return {
    status: true,
    data: data,
  }

}

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
