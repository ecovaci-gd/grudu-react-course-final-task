import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import useRedirectIfLoggedIn from "../hooks/useRedirectIfLoggedIn";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const navigate = useNavigate();
  useRedirectIfLoggedIn();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordRegex = /^.{8,256}$/;

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users?email=${data.email}`,
      );
      const users = await response.json();

      if (users.length === 0) {
        alert("Invalid email or password");
        return;
      }

      const user = users[0];
      if (user.password === data.password) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/tweets");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: emailRegex,
                message: "Invalid email address.",
              },
            })}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: passwordRegex,
                message: "Password must be 8-256 characters long.",
              },
            })}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>

      <div className={styles.redirect}>
        <p>
          Don't have an account?{" "}
          <a href="/signup" className={styles.redirectLink}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
