import requests from "../config/requests";

export const getSummary = () => {
    return requests.get("/reports/summary");
};

export const getProjectsMostPending = () => {
    return requests.get("/reports/projects-most-pending");
};

export const getCompletedTasks = (period = "week") => {
    return requests.get("/reports/completed-tasks", { params: { period } });
};

export const getTasksByStatus = () => {
    return requests.get("/reports/tasks-by-status");
};

export const getProductivityByDay = (period = "month") => {
    return requests.get("/reports/productivity-by-day", { params: { period } });
};
