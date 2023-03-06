import React from "react";
import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import PageTitle from "./Components/PageTitle";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login/Login";
import { Registration } from "./pages/Registration/Registration";
import { Header } from "./Components/Header";
import styles from "./styles/modules/app.module.scss";

function App() {
  // const onSortReminds = (type) => {
  //   switch (type) {
  //     case "deadline":
  //       setReminds(
  //         reminds
  //           .slice()
  //           .sort((a, b) => moment(a.deadline_at).diff(moment(b.deadline_at)))
  //       );
  //       break;
  //     case "created":
  //       setReminds(
  //         reminds
  //           .slice()
  //           .sort((a, b) => moment(a.created_at).diff(moment(b.created_at)))
  //       );
  //       break;
  //     default:
  //       return;
  //   }
  // };

  return (
    <div className={styles.bg_container}>
      <Header />
      <div className="container">
        <PageTitle>Reminder GO</PageTitle>
        <div className={styles.app__wrapper}>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
          </Routes>
        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: "1.4rem",
          },
        }}
      />
    </div>
  );
}

export default App;
