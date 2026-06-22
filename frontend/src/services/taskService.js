import requests from "../config/requests";

export const getTasks = (params = {}) => {
    return requests.get("/tasks", { params });
};

export const createTask = (data) => {
    return requests.post("/tasks", data);
};

export const updateTask = (id, data) => {
    return requests.put(`/tasks/${id}`, data);
};

export const deleteTask = (id) => {
    return requests.delete(`/tasks/${id}`);
};
