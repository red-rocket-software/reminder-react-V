import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/modules/header.module.scss";
import { MdAccountCircle } from "react-icons/md";
import {  useSelector } from "react-redux";


export const Header = () => {
  const isAuth = useSelector((state) => Boolean(state.auth.user));


  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          R
        </Link>
        <div className={styles.buttons}>
          {isAuth ? (
            <>
              <div className={styles.avatar}>
                <p>name</p>
                <MdAccountCircle size="3em"/>
              </div>
            </>
          ) : (
            <div className={styles.auth}>
              <Link to="/login">Login</Link>
              <Link to="/register">Registration</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
