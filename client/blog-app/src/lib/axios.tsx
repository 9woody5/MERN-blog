import axios, { AxiosInstance } from "axios";

const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
};

const instance = createAxiosInstance();

export default instance;
