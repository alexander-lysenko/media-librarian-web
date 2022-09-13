import axios from "axios";

export const axiosInstance = () => {
  const instance = axios.create();

  instance.defaults.timeout = 5000;
  instance.defaults.headers.common["Authorization"] = "Bearer 0000";
  instance.defaults.headers.post["Content-Type"] = "application/json";

  return instance;
};
