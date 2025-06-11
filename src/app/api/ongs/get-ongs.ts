/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/app/services/api";
import { ISearchParamsRoot } from "@/interfaces/api";

export async function getOngs({ page, per_page, search }: ISearchParamsRoot) {
  try {
    const response = await api.get(`http://localhost:8000/api/ongs`, {
      params: {
        page,
        per_page,
        search,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error.response?.data || error.message || error);
    throw new Error(error.response?.data.message || "Error fetching data");
  }
}
