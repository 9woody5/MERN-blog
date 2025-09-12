import axios, { AxiosInstance } from "axios";

const resolveBaseURL = (): string => {
  const envBaseURL = import.meta.env?.VITE_API_BASE_URL as string | undefined;

  if (envBaseURL && envBaseURL.trim().length > 0) {
    return envBaseURL;
  }

  const isLocalhost = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "[::1]");

  return isLocalhost
    ? "http://localhost:4000"
    : "https://port-0-mern-blog-754g42alul99nxi.sel5.cloudtype.app";
};

const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: resolveBaseURL(),
    withCredentials: true,
  });
};

const instance = createAxiosInstance();

export default instance;
