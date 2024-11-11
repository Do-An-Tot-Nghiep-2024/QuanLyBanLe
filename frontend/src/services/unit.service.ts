import api from "../config/axios";
import { UnitSchema } from "../types/unitSchema";

const getUnitService = async () => {
  try {
    const response: any = await api.get(
      `/units`
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

const createUnitService = async (unit:any ) => {
    try {
      const response = await api.post(`/units`, {name : unit} );
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
      console.error("Error creating unit: ", error);
      return {
        status: false,
        message: "An error occurred while creating the unit",
        data: [],
      };
    }
};

const updateUnitService = async (unitId: number, unitSchema: UnitSchema) => {
    try {
      const response = await api.put(`/units/${unitId}`, unitSchema);
      const { message, data } = response.data;
      console.log(response);
      
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
        console.error("Error updating unit: ", error);
        return {
        status: false,
        message: "An error occurred while updating the unit",
        data: [],
        };
    }

}
 
const deleteUnitService = async (unitId: any) => {
    try {
        await api.delete(`/units/${unitId}`);
    } catch (error) {
        console.error("Error deleting unit: ", error);
        return {
            status: false,
            message: "An error occurred while deleting the unit",
            data: [],
        };
    }
}
  
export { getUnitService, deleteUnitService, createUnitService, updateUnitService };