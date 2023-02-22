import React from "react";
import styles from "../../styles/modules/login.module.scss";
import { Formik } from "formik";
import { registrationSchema } from "../../utils/schemas";
import Oauth from "../../Components/Oauth";

export const Registration = () => {
  return (
    <div className={styles.formWrapper}>
      <Formik
        validationSchema={registrationSchema}
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          console.log(JSON.stringify(values));
        }}
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
                  type="name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder="Enter name"
                  autoComplete="off"
                />
                <p className={styles.error}>
                  {errors.name && touched.name && errors.name}
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
                <button type="submit">Sign up</button>
              </form>
            </div>
          </div>
        )}
      </Formik>
      <b>OR USE</b>
      <Oauth />
    </div>
  );
};
