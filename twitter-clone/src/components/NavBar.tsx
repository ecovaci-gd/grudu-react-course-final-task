import { useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import { getUserFromLocalStorage } from "../utils/getUserFromLocalStorage";

const NavBar = () => {
  const navigate = useNavigate();
  const user = getUserFromLocalStorage();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={styles.navbar}>
      <span className={styles.username}>{user.fullName || user.email}</span>
      <button className={styles.logoutButton} onClick={logout}>
        Log Out
      </button>
    </div>
  );
};

export default NavBar;
