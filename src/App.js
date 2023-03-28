import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PageTitle from "./Components/PageTitle";
import { Home } from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login/Login";
import { Registration } from "./pages/Registration/Registration";
import { Header } from "./Components/Header";
import styles from "./styles/modules/app.module.scss";

//redux
import { useDispatch } from "react-redux";
import { fetchAuthMe } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <div className={styles.bg_container}>
      <Header />
      <div className="container">
        <PageTitle>Reminder GO</PageTitle>
        <div className={styles.app__wrapper}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="*" element={<NotFound />} />
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
