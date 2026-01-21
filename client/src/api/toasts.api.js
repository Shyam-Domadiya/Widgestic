import api from './axios';

export const getToasts = async () => {
    const response = await api.get('/toasts');
    return response.data;
};

export const createToast = async (toastData) => {
    const response = await api.post('/toasts', toastData);
    return response.data;
};

export const updateToast = async (id, toastData) => {
    const response = await api.put(`/toasts/${id}`, toastData);
    return response.data;
};

export const deleteToast = async (id) => {
    const response = await api.delete(`/toasts/${id}`);
    return response.data;
};
