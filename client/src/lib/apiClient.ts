import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://172.16.1.31:8080/api/v1",
    headers: {
        "Content-Type": "application/json"
    },
});