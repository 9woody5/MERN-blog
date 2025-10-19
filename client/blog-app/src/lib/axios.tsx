import axios, { AxiosInstance } from "axios";

const PROD_URL =
  "https://port-0-mern-blog-754g42alul99nxi.sel5.cloudtype.app" as const;

const resolveBaseURL = (): string => {
  const envBaseURL = import.meta.env?.VITE_API_BASE_URL as string | undefined;
  if (envBaseURL && envBaseURL.trim().length > 0) return envBaseURL;

  const isProd = import.meta.env?.MODE === "production";
  if (isProd) return PROD_URL;

  return "http://localhost:4000";
};

const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: resolveBaseURL(),
    withCredentials: true,
  });
};

const instance = createAxiosInstance();

export default instance;
