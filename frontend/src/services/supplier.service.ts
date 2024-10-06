import api from "../config/axios";
import { SupplierSchema } from '../types/supplierSchema';

const getSuppliersService = async () => {
    try {
        const response = await api.get(`/suppliers`);
      return {
        data: response.data,
      };
    } catch (error) {
      console.error("Error get data: ", error);
      return {
        status: false,
        message: "An error occurred while getting the data",
        data: [],
      };
    }
};
  
const createSupplierService = async (supplier: SupplierSchema) => { 
  try {
    const response = await api.post(`/suppliers`, supplier);
    const { message, data } = response.data;
    console.log(response.data);
      
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
    console.error("Error creating supplier: ", error);
    return {
      status: false,
      message: "An error occurred while creating the supplier",
      data: [],
    }

  }
}

const deleteSupplierService = async (id: number) => { 
  try {
    const response = await api.delete(`/suppliers/${id}`);
    const { message, data } = response.data;
    console.log(response.data);
      
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
    console.error("Error deleting supplier: ", error);
    return {
      status: false,
      message: "An error occurred while deleting the supplier",
      data: [],
    }

  }
}

const getSupplierByIdService = async (id : any) => {
  try {
      const response = await api.get(`/suppliers/${id}`);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error("Error get data: ", error);
    return {
      status: false,
      message: "An error occurred while getting the data",
      data: [],
    };
  }
};

const updateSupplierService = async (id: number, supplier: SupplierSchema) => {
  try {
    const response = await api.put(`/suppliers/${id}`, supplier);
    const { message, data } = response.data;
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
    console.error("Error updating supplier: ", error);
    return {
      status: false,
      message: "An error occurred while updating the supplier",
      data: [],
    };
  }
 }

  export { getSuppliersService, createSupplierService,  deleteSupplierService, getSupplierByIdService, updateSupplierService };