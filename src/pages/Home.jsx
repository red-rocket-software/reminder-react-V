import React from "react";
import ContentHeader from "../Components/ContentHeader";
import AppContent from "../Components/AppContent";
import { useSelector } from "react-redux";

export const Home = () => {
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
