import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuthValue from "../hooks/useAuthValue";

const PrivateRoute = ({ children }) => {
  const { pathname } = useLocation();
  const { loading, user } = useAuthValue();
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (user) return children;
  return <Navigate state={pathname} replace to="/login"></Navigate>;
};

export default PrivateRoute;
