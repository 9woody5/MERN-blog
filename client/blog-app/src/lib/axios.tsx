import axios, { AxiosInstance } from "axios";

const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: "https://port-0-mern-blog-754g42alul99nxi.sel5.cloudtype.app",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
};

const instance = createAxiosInstance();

export default instance;
