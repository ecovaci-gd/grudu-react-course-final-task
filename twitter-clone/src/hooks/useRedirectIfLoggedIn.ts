import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromLocalStorage } from "../utils/getUserFromLocalStorage";

const useRedirectIfLoggedIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user.id) {
      navigate("/tweets");
    }
  }, [navigate]);
};

export default useRedirectIfLoggedIn;
