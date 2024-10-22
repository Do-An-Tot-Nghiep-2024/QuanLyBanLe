import api from "../config/axios";
import { CategorySchema } from "../types/categorySchema";

const getCategoriesService = async () => {
  try {
    const response: any = await api.get(
      `/categories`
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

const createCategoryService = async (category:any ) => {
    try {
      const response = await api.post(`/categories`, {name : category} );
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
      console.error("Error creating category: ", error);
      return {
        status: false,
        message: "An error occurred while creating the category",
        data: [],
      };
    }
};

const updateCategoryService = async (categoryId: number, categorySchema: CategorySchema) => {
    try {
      const response = await api.put(`/categories/${categoryId}`, categorySchema);
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
        console.error("Error updating category: ", error);
        return {
        status: false,
        message: "An error occurred while updating the category",
        data: [],
        };
    }

}
 
const deleteCategoryService = async (categoryId: any) => {
    try {
        await api.delete(`/categories/${categoryId}`);
    } catch (error) {
        console.error("Error deleting category: ", error);
        return {
            status: false,
            message: "An error occurred while deleting the category",
            data: [],
        };
    }
}
  
export { getCategoriesService, createCategoryService, updateCategoryService, deleteCategoryService };