import api from "../config/axios";
import ApiResponse from "../types/apiResponse";
import { EmployeeSchema } from "../types/employeeSchema";

const getEmployeesService = async (page: number, limit: number) => {
  try {
    const response: any = await api.get(
      `/employees?pageNumber=${page}&pageSize=${limit}`
    );
    const { message, data } = response;
    if (message !== "success") {
      return {
        status: false,
        message: message,
        data: [],
      };
    }
    return {
      status: true,
      message: message,
      data: data,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "An error occurred",
      data: [],
    };
  }
};

const getEmployeeByIdService = async (id: number) => {
  try {
    const response: ApiResponse = await api.get(`/employees/${id}`);
    if (response.message !== "success") {
      return {
        message: response.message,
        data: {},
      };
    }
    return response;
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: {},
    } as ApiResponse;
  }
};

const createEmployeeService = async (employee: EmployeeSchema) => {
  try {
    const response: ApiResponse = await api.post("/employees", employee);
    console.log(response);
    const { message, data } = response;
    if (message !== "success") {
      return {
        message: message,
        data: {},
      };
    }

    return {
      message: message,
      data: data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: {},
    };
  }
};

const deleteEmployeeService = async (id: number) => {
  try {
    const response: ApiResponse = await api.delete(`/employees/${id}`);
    if (response.message !== "success") {
      return {
        message: response.message,
        data: {},
      };
    }
    return {
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: {},
    };
  }
};
const updateEmployeeService = async (id: number, employee: EmployeeSchema) => {
  try {
    const response: ApiResponse = await api.put(`/employees/${id}`, employee);
    if (response.message !== "success") {
      return {
        message: response.message,
        data: {},
      };
    }
    return {
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: {},
    };
  }
};

const exportEmployeeService = async () => {
  try {
    const response: ApiResponse = await api.get("/employees/export");
    if (response.message !== "success") {
      return {
        message: response.message,
        data: {},
      };
    }
    return {
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: {},
    };
  }
};

export {
  createEmployeeService,
  getEmployeesService,
  deleteEmployeeService,
  updateEmployeeService,
  getEmployeeByIdService,
  exportEmployeeService
};
