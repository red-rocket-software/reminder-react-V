import React, { useEffect, useCallback } from "react";
import ContentHeader from "../Components/ContentHeader";
import AppContent from "../Components/AppContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe } from "../store/slices/authSlice";

export const Home = () => {
  const dispatch = useDispatch();

  const handleFetchMe = useCallback(async () => {
    const data = await dispatch(fetchAuthMe());
    if (!Boolean(localStorage.getItem("userInfo"))) {
      const userData = {
        name: data.payload?.name,
        email: data.payload.email,
        avatarURL: data.payload.photo,
      };
      localStorage.setItem("userInfo", JSON.stringify(userData));
    }
  }, [dispatch]);
  
  useEffect(() => {
    handleFetchMe();
  }, [handleFetchMe]);

  const isAuth = useSelector((state) => Boolean(state.auth.isAuth));

  return isAuth ? (
    <>
      <ContentHeader />
      <AppContent />
    </>
  ) : (
    <h1 style={{ textAlign: "center" }}>
      Welcome to Application. Please login to continue
    </h1>
  );
};
