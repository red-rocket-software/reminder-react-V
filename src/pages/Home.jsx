import React from "react";
import ContentHeader from "../Components/ContentHeader";
import AppContent from "../Components/AppContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe } from "../store/slices/authSlice";
import { async } from "q";

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
  const dispatch = useDispatch();

  const handleFetchMe = async() => {
    const data = await dispatch(fetchAuthMe())
    console.log(data);
    if(!Boolean(localStorage.getItem('userInfo'))){
      const userData = {name: data.payload.name, email: data.payload.email, avatarURL: data.payload.photo}
        localStorage.setItem('userInfo', JSON.stringify(userData))
    }

  }

  React.useEffect(() => {
    handleFetchMe()
  }, [])
  
  const isAuth = useSelector((state) => Boolean(state.auth.isAuth))
  return  isAuth ? (
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
