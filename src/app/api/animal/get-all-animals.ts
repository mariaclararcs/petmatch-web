/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAnimalSearchParams } from "@/interfaces/api";

export async function getAllAnimals(params: IAnimalSearchParams) {
  try {
    // Monta os query params
    const queryParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    // Monta a URL com query params
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const url = `http://localhost:8000/api/animals${queryString ? `?${queryString}` : ''}`;

    // Usa fetch diretamente para não exigir autenticação
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao buscar animais' }));
      throw new Error(errorData.message || 'Erro ao buscar animais');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error.message || error);

    throw new Error(error.message || "Error fetching data");
  }
}
