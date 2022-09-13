import { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axiosInstance";

type BaseApiRequest = {
  url: string;
  config?: AxiosRequestConfig;
};

export const baseApiRequest = async () => {
  const instance = axiosInstance();

  return await instance.request({});
};
