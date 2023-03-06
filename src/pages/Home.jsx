import React from "react";
import ContentHeader from "../Components/ContentHeader";
import AppContent from "../Components/AppContent";
import { useSelector } from "react-redux";

export const Home = ({
  // createRemind,
  getAllReminds,
  getCompletedReminds,
  getCurrentReminds,
  onSortReminds,
  // reminds,
  updateRemind,
  // deleteRemind,
  noMoreReminds,
  cursor,
}) => {
  const isAuth = useSelector((state) => Boolean(state.auth.isAuth));
  return isAuth ? (
    <>
      <ContentHeader
        // onCreate={createRemind}
        onGetAll={getAllReminds}
        onGetCompleted={getCompletedReminds}
        onGetCurrent={getCurrentReminds}
        onSort={onSortReminds}
      />
      <AppContent
        // reminds={reminds}
        onUpdateRemind={updateRemind}
        // onDeleteRemind={deleteRemind}
        onGetAll={getAllReminds}
        onGetCompleted={getCompletedReminds}
        onGetCurrent={getCurrentReminds}
        noMoreReminds={noMoreReminds}
        cursor={cursor}
      />
    </>
  ) : (
    <h1 style={{ textAlign: "center" }}>
      Welcome to Application. Please login to continue
    </h1>
  );
};
