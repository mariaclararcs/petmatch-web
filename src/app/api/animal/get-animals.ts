/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/app/services/api";
import { IAnimalSearchParams } from "@/interfaces/api";

export async function getAnimals(params: IAnimalSearchParams) {
  try {
    // Remove undefined and empty values
    const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const response = await api.get(`http://localhost:8000/api/animals`, {
      params: queryParams,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error.response?.data || error.message || error);

    throw new Error(error.response?.data.message || "Error fetching data");
  }
}
