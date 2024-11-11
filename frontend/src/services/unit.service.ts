import api from "../config/axios";

const getUnitsService = async () => {
  try {
    const response: any = await api.get("/units");
    if (response.message !== "success") {
      return {
        message: response.message,
        data: null,
      };
    }
    return {
      message: "success",
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: null,
    };
  }
};

const getUnitService = async (id: number) => {
  try {
    const response: any = await api.get(`/units/${id}`);
    if (response.message !== "success") {
      return {
        message: response.message,
        data: null,
      };
    }
    return {
      message: "success",
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: null,
    };
  }
};

const createUnitService = async (data: any) => {
  try {
    const response: any = await api.post("/units", data);
    if (response.message !== "success") {
      return {
        message: response.message,
        data: null,
      };
    }
    return {
      message: "success",
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: null,
    };
  }
};

const deleteUnitService = async (id: number) => {
  try {
    const response: any = await api.delete(`/units/${id}`);
    if (response.message !== "success") {
      return {
        message: response.message,
        data: null,
      };
    }
    return {
      message: "success",
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: null,
    };
  }
};

const updateUnitService = async (id: number, data: any) => {
  try {
    const response: any = await api.put(`/units/${id}`, data);
    if (response.message !== "success") {
      return {
        message: response.message,
        data: null,
      };
    }
    return {
      message: "success",
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: null,
    };
  }
};
export {
  getUnitsService,
  getUnitService,
  createUnitService,
  deleteUnitService,
  updateUnitService,
};
