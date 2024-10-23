import api from "../config/axios";
import { GetProductSchema } from "../types/getProductSchema";
import { ProductSchema } from "../types/productSchema";
import { UpdateProductSchema } from "../types/updateProductSchema";


const createProductService = async (productRequest: ProductSchema, imageFile: File) => {
  try {
    console.log(productRequest);
    console.log(imageFile);
    const formData = new FormData();
    formData.append("productRequest", new Blob([JSON.stringify(productRequest)], {
      type: "application/json",
    }));
    formData.append("file", imageFile);
    console.log(formData);
    const response: ApiResponse = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
      message: error.response?.data?.message || "An error occurred",
      data: {},
    };
  }
};

const updateProductService = async (id: number, productRequest: UpdateProductSchema, imageFile: File) => {
  try {
    console.log(productRequest);
    console.log(imageFile);

    const formData = new FormData();

    formData.append("productRequest", new Blob([JSON.stringify(productRequest)], {
      type: "application/json",
    }));
    formData.append("file", imageFile);
    console.log(formData);
    const response: ApiResponse = await api.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
      message: error.response?.data?.message || "An error occurred",
      data: {},
    };
  }
}

const getProductsService = async (page: number, limit: number) => {
  try {
    const response: ApiResponse = await api.get(`/products?pageNumber=${page}&pageSize=${limit}`);
    const { message, data } = response;

    if (message !== "success") {
      return {
        message: message,
        data: [],
      };
    }

    return {
      message: message,
      data: data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "An error occurred",
      data: [],
    };
  }
}

// const getAllProductsService = async () => {
//   try {
//     const response: GetAllProductsResponse = await api.get(`/products`);
//     const { message, data } = response;
  

//     if (message !== "success") {
//       return {
//         message: message,
//         data: [] as GetProductSchema[],
//       };
//     }

//     return {
//       message: message,
//       data: data,
//     };
//   } catch (error: any) {
//     return {
//       message: error.response?.data?.message || "An error occurred",
//       data: [] as GetProductSchema[],
//     };
//   }
// }


const getAllProductsService = async (): Promise<{ message: string; data: GetProductSchema[] | null }> => {
  try {
    const response: ApiResponse = await api.get(`/products`);
    const { message, data } = response;

    console.log(data);

    return {
      message,
      data: message === "success" ? (data as unknown as GetProductSchema[]) : null,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    
    return {
      message: String(error),
      data: null,
    };
  }
};


// const getProductByIdService = async (id: any) => { 
//     try {
//       const response: ApiResponse = await api.get(`/products/${id}`);
//       const { message, data } = response;

//       console.log(data);

//       if (message !== "success") {
//         return {
//           message: message,
//           data: {},
//         };
//       }

//       return {
//         message: message,
//         data: data,
//       };
//     } catch (error: any) {
//       return {
//         message: error.response?.data?.message || "An error occurred",
//         data: {},
//       };
//     }
// }

// Define your GetProductSchema interface
// interface GetProductSchema {
//   id: number;
//   name: string;
//   image: string;
//   category: string;
//   supplier: string;
//   price: number;
// }

// Define your API response interface
interface ApiResponse {
  message: string;
  data: GetProductSchema; // Ensure this reflects the actual expected structure
}


const getProductByIdService = async (id: number): Promise<{ message: string; data: GetProductSchema | null }> => {
  try {
    const response: ApiResponse = await api.get(`/products/${id}`);
    const { message, data } = response;

    console.log(data);

    return {
      message,
      data: message === "success" ? (data as GetProductSchema) : null,
    };
  } catch (error) {
    // const errorMessage = error?.response?.message || "An error occurred";
    console.error("Error fetching product:", error);
    
    return {
      message: String(error),
      data: null,
    };
  }
};




const deleteProductService = async (id: number) => {
  try {
    const response: ApiResponse = await api.delete(`/products/${id}`);

    console.log(response);

    return {
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "An error occurred",
      data: {},
    };
  }
}

export { getAllProductsService, createProductService, getProductByIdService, getProductsService, updateProductService, deleteProductService };