import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://18.177.143.232:8080/api/v1",
    headers: {
        "Content-Type": "application/json"
    },
});