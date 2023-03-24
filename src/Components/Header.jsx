import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/modules/header.module.scss";
import UserBar from "./UserBar";
import { MdOutlineConstruction } from "react-icons/md";
import Button from "./Button";
import { getClasses } from "../utils/getClasses";

//  redux
import { useDispatch, useSelector } from "react-redux";
import { fetchLogout } from "../store/slices/authSlice";
import { resetItems } from "../store/slices/remindSlice";
import ConfigDrawer from "./ConfigDrawer";

export const Header = () => {
  const [configOpen, setConfigOpen] = useState(false);
  const { user, isAuth } = useSelector((state) => state.auth);

  const navigator = useNavigate();

  const firstLeter =
    isAuth && user?.name.split(" ").map((el) => el[0].toUpperCase());
  const dispatch = useDispatch();

  const onClickCongig = () => {
    setConfigOpen(!configOpen);
  };

  const onClickLogout = useCallback(() => {
    if (window.confirm("Are you sure you want to log out")) {
      dispatch(fetchLogout());
      dispatch(resetItems());
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userNotifyStatus");
      localStorage.removeItem("userNotifyStatusPeriod");
      navigator("/");
    }
  }, [dispatch, navigator]);

  return (
    <>
      {configOpen && <ConfigDrawer setOpen={onClickCongig} />}

      <div
        className={getClasses([styles.container, isAuth && styles.golang_img])}
      >
        <div className={styles.inner}>
          <div className={styles.leftBar}>
            <Link to="/" className={styles.logo}>
              R
            </Link>
            {isAuth && (
              <div className={styles.configIcon} onClick={onClickCongig}>
                <MdOutlineConstruction />
              </div>
            )}
          </div>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <UserBar {...user} firstLeter={firstLeter} />
                <Button onClick={onClickLogout} type="submit" variant="logout">
                  Log out
                </Button>
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
    </>
  );
};
