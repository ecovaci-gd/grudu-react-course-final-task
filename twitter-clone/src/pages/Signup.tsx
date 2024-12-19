import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import useRedirectIfLoggedIn from "../hooks/useRedirectIfLoggedIn";

interface SignupFormData {
  email: string;
  password: string;
  fullName: string;
}

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const navigate = useNavigate();
  useRedirectIfLoggedIn();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordRegex = /^.{8,256}$/;
  const fullNameRegex = /^.{1,512}$/;

  const onSubmit = async (data: SignupFormData) => {
    const userId = data.fullName
      ? data.fullName.toLowerCase().replace(/\s+/g, "_")
      : data.email;

    const userData = { ...data, id: userId };

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/tweets");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Signup</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName" className={styles.label}>
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            className={styles.input}
            {...register("fullName", {
              required: "Full name is required",
              pattern: {
                value: fullNameRegex,
                message: "Full name must be between 1 and 512 characters.",
              },
            })}
          />
          {errors.fullName && (
            <p className={styles.error}>{errors.fullName.message}</p>
          )}
        </div>

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
          Signup
        </button>
      </form>

      <div className={styles.redirect}>
        <p>
          Already have an account?{" "}
          <a href="/login" className={styles.redirectLink}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
