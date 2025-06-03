import { ISearchParamsRoot } from "@/interfaces/api";
import api from "@/services/api";

export async function getAnimals({
    page,
    per_page,
    search,
}: ISearchParamsRoot) {
    try {
        const response = await api.get(`http://localhost:8000/api/animal`, {
            params: {
                page,
                per_page,
                search,
            },
        });

        return response.data;
    } catch(error: any) {
        console.error(
            'Error fetching data:',
            error.response?.data || error.message || error
        );

        throw new Error(error.response?.data.message || 'Error fetching data');
    }
}