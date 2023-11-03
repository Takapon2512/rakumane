import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://e-rakumane.com:8080/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});