import axios from "axios";

//開発で使う際はbaseURLを「http://localhost:8080/api/v1」に変更すること
export const apiClient = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});