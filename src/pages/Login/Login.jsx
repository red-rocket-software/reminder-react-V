import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { Formik } from "formik";
import toast from "react-hot-toast";
import { fetchLogin } from "../../store/slices/authSlice";
import Oauth from "../../Components/Oauth";

import styles from "../../styles/modules/login.module.scss";

import { loginSchema } from "../../utils/schemas";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuth = useSelector((state) => Boolean(state.auth.isAuth));

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const data = await dispatch(fetchLogin(values));
        const userData = {
          name: data.payload.name,
          email: data.payload.email,
          avatarURL: data.payload.photo,
        };
        localStorage.setItem("userInfo", JSON.stringify(userData));
        toast.success("Logged in Successfully");
        navigate("/");
      } catch (error) {
        toast.success("Failed to login");
      }
    },
    [dispatch, navigate]
  );

  return (!isAuth?<div className={styles.formWrapper}>
    <Formik
      validationSchema={loginSchema}
      initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <div>
          <div className={styles.form}>
            <form noValidate onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Enter email"
                id="email"
                autoComplete="off"
              />
              <p className={styles.error}>
                {errors.email && touched.email && errors.email}
              </p>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder="Enter password"
                autoComplete="off"
              />
              <p className={styles.error}>
                {errors.password && touched.password && errors.password}
              </p>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </Formik>
    <b>OR USE</b>
    <Oauth />
  </div>:<Navigate to="/" />);
};
