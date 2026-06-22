import requests from "../config/requests";

export const login = ({ email, password }) => {
    return requests.post("/auth/login", { email, password });
};

export const register = ({ name, email, password, repeatPassword }) => {
    return requests.post("/auth/register", {
        name,
        email,
        password,
        repeat_password: repeatPassword,
    });
};
