import axios from 'axios';
import { API_HOST } from './Constants';

const baseUrl = `${API_HOST}/api`;

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error?.response?.status === 400 || error?.response?.status === 403 || error?.response?.status === 404 || error?.response?.status === 409 || error?.response?.status === 500) {}
        if (error?.response?.data?.isAuth === false) {
            localStorage.clear();
        }
        return error.response ? error.response : Promise.reject(new Error(error));
    }
);

export const addDocument = async (data) => {
    return await axiosInstance.post(`${baseUrl}/User/AddDocument`, data);
};

export const addUpdateDocument = async (data) => {
    return await axiosInstance.post(`${baseUrl}/User/AddUpdateDocument`, data);
};
// export const addUpdateDepartmentDocument = async (data) => {
//     return await axiosInstance.post(`${baseUrl}/User/AddUploadUpdateDocument`, data);
// };

export const getAllDocument = async () => {
    return await axiosInstance.get(`${baseUrl}/User/GetUser`);
};

export const getDocumentById = async (id) => {
    return await axiosInstance.get(`${baseUrl}/User/GetUserByID?id=${id}`);
};

export const updateDocument = async (data) => {
    return await axiosInstance.put(`${baseUrl}/User/UpdateUser`, data);
};

export const deleteDocument = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/User/DeleteUser?id=${id}`);
};

export const deleteDocumentFile = async (id) => {
    return await axiosInstance.delete(`${baseUrl}/User/DeleteFile?id=${id}`);
};

export const deleteDepartment = async (id, department) => {
    return await axiosInstance.delete(`${baseUrl}/User/${id}/${department}`);
};

export const deleteMultipleDocuments = async (ids) => {
    return await axiosInstance.delete(`${baseUrl}/User/delete-multiple-document`, { data: ids });
};

// const deleteMultipleDocuments = async (ids) => {
//     try {
//         const response = await axiosInstance.delete(`${baseUrl}/User/delete-multiple-document`, {
//             data: { ids: ids }
//         });

//         return response;
//     } catch (error) {
//         throw error;
//     }
// };


// export const getAllDocument = async () => {
//     let subUrl = `${baseUrl}/User/GetUserByID`;
//     return await axiosInstance.get(`${subUrl}`);
// };