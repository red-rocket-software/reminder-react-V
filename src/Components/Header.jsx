import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/modules/header.module.scss";
import { useDispatch, useSelector } from "react-redux";
import UserBar from "./UserBar";
import { fetchLogout } from "../store/slices/authSlice";

export const Header = () => {
  const isAuth = useSelector((state) => state.auth.isAuth)
  const {user}  = useSelector((state) => state.auth)
  //const firstLeter = isAuth && user.name.split(' ').map((el) => el[0].toUpperCase())
  const firstLeter = "M"
  const dispatch = useDispatch()

  function onClickLogout() {
    if (window.confirm('Are you sure you want to log out')) {
      dispatch(fetchLogout())
      window.localStorage.removeItem('userInfo')
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          R
        </Link>
        <div className={styles.buttons}>
          {isAuth ? (
            <>
             <UserBar {...user} firstLeter = {firstLeter}/>
             <button type="submit" onClick={onClickLogout}>Log out</button>
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
