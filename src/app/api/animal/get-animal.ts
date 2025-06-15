/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/app/services/api";

export async function getAnimal(id: string) {
  try {
    const response = await api.get(`http://localhost:8000/api/animals/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching animal:", error.response?.data || error.message || error);
    throw new Error(error.response?.data.message || "Error fetching animal");
  }
} 