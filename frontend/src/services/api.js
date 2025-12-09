import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/sales`;

export const fetchSales = async (params) => {
    try {
        const response = await axios.get(API_URL, {
            params,
            paramsSerializer: (params) => {
                const searchParams = new URLSearchParams();
                Object.keys(params).forEach(key => {
                    const value = params[key];
                    if (Array.isArray(value)) {
                        value.forEach(v => searchParams.append(key, v));
                    } else if (value !== undefined && value !== null && value !== '') {
                        searchParams.append(key, value);
                    }
                });
                return searchParams.toString();
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
    }
};

export const fetchFilters = async () => {
    try {
        const response = await axios.get(`${API_URL}/filters`);
        return response.data;
    } catch (error) {
        console.error('Error fetching filters:', error);
        throw error;
    }
};
