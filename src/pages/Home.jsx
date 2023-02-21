import React from "react";
import ContentHeader from "../Components/ContentHeader";
import AppContent from "../Components/AppContent";

export const Home = ({
  createRemind,
  getAllReminds,
  getCompletedReminds,
  getCurrentReminds,
  onSortReminds,
  reminds,
  updateRemind,
  deleteRemind,
  noMoreReminds,
  cursor,
}) => {
  return (
    <>
      <ContentHeader
        onCreate={createRemind}
        onGetAll={getAllReminds}
        onGetCompleted={getCompletedReminds}
        onGetCurrent={getCurrentReminds}
        onSort={onSortReminds}
      />
      <AppContent
        reminds={reminds}
        onUpdateRemind={updateRemind}
        onDeleteRemind={deleteRemind}
        onGetAll={getAllReminds}
        onGetCompleted={getCompletedReminds}
        onGetCurrent={getCurrentReminds}
        noMoreReminds={noMoreReminds}
        cursor={cursor}
      />
    </>
  );
};
