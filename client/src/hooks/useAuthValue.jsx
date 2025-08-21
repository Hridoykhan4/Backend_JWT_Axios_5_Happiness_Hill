import { useContext } from "react";
import AuthContext from "../Provider/Authentication/AuthContext";

const useAuthValue = () => useContext(AuthContext);

export default useAuthValue;
