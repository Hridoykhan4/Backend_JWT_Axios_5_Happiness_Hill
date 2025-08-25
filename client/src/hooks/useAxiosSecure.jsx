import axios from "axios";
import { useEffect } from "react";
import useAuthValue from "./useAuthValue";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useAuthValue();
  const nav = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const axiosInterceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          await logOut();
          toast.error(
            err?.response?.data?.message ||
              "Session expired. Please log in again."
          );
          if (location.pathname !== "/login") {
            nav("/login", { replace: true });
          }
        }
        return Promise.reject(err);
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(axiosInterceptor);
    };
  }, [nav, logOut, location.pathname]);
  return axiosInstance;
};
export default useAxiosSecure;
