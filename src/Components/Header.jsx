<<<<<<< HEAD
import React, { useCallback } from "react";
=======
import React from "react";
>>>>>>> 10d2abdaf8713d5047dc7c66c4db301bf6fea4e3
import { Link } from "react-router-dom";
import styles from "../styles/modules/header.module.scss";
import UserBar from "./UserBar";

<<<<<<< HEAD
import { getClasses } from "../utils/getClasses";

=======
>>>>>>> 10d2abdaf8713d5047dc7c66c4db301bf6fea4e3
//  redux
import { useDispatch, useSelector } from "react-redux";
import { fetchLogout } from "../store/slices/authSlice";
import { resetItems } from "../store/slices/remindSlice";

export const Header = () => {
  const { user, isAuth } = useSelector((state) => state.auth);

  const firstLeter =
    isAuth && user?.name.split(" ").map((el) => el[0].toUpperCase());
  const dispatch = useDispatch();

  const onClickLogout = useCallback(() => {
    if (window.confirm("Are you sure you want to log out")) {
      dispatch(fetchLogout());
      dispatch(resetItems());
      localStorage.removeItem("userInfo");
    }
  }, [dispatch]);

  return (
    <div
      className={getClasses([styles.container, isAuth && styles.golang_img])}
    >
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          R
        </Link>
        <div className={styles.buttons}>
          {isAuth ? (
            <>
              <UserBar {...user} firstLeter={firstLeter} />
              <button type="submit" onClick={onClickLogout}>
                Log out
              </button>
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
