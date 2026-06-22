import requests from "../config/requests";

export const getProjects = (params = {}) => {
    return requests.get("/projects", { params });
};

export const getProject = (id) => {
    return requests.get(`/projects/${id}`);
};

export const createProject = (data) => {
    return requests.post("/projects", data);
};

export const updateProject = (id, data) => {
    return requests.put(`/projects/${id}`, data);
};

export const deleteProject = (id) => {
    return requests.delete(`/projects/${id}`);
};
