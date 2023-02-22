import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import PageTitle from "./Components/PageTitle";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login/Login";
import { Registration } from "./pages/Registration/Registration";
import { Header } from "./Components/Header";
import styles from "./styles/modules/app.module.scss";
import axios from "./utils/axios";
import moment from "moment";
import toast from "react-hot-toast";

import { useSelector, useDispatch } from "react-redux";

import Context from "./utils/context";

const limit = 5;

function App() {
  const [reminds, setReminds] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [noMoreReminds, setNoMoreReminds] = useState(true);

  const [context, setContext] = useState({
    filter: "all",
    timeRange: [new Date(), new Date()],
  });

  useEffect(() => {
    setReminds([]);
    setCursor(0);
  }, [context.filter]);

  // fetch all reminds in first render of app
  useEffect(() => {
    getAllReminds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ! uncomment when redux will be ready
  // const dispatch = useDispatch();
  // React.useEffect(() => {
  //   dispatch(fetchAuthMe());
  // }, []);
  // !

  const getAllReminds = async (cur) => {
    try {
      await axios
        .get(`/remind`, {
          params: {
            cursor: cur !== 0 ? cursor : 0,
            limit: limit,
          },
        })
        .then(({ data }) => {
          setReminds((prev) => {
            if (
              JSON.stringify(prev) === JSON.stringify(data.todos) ||
              data.todos.length === 0
            ) {
              return prev;
            } else {
              return [...prev, ...data.todos];
            }
          });
          checkForMoreReminds(data.pageInfo.nextCursor);
          setCursor(data.pageInfo.nextCursor);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const createRemind = async (data) => {
    try {
      await axios.post("/remind", data);
      if (context.filter === "all" || context.filter === "current") {
        setReminds((prev) => [data, ...prev]);
      }
      toast.success("Remind Added Successfully");
    } catch (error) {
      toast.error("Failed To Add Remind");
      console.log(error);
    }
  };

  const updateRemind = async (data) => {
    try {
      await axios.put(`/remind/${data.id}`, data);

      // we change app reminds according to the filter
      if (context.filter === "current" || context.filter === "completed") {
        setReminds(reminds.filter((remind) => remind.id !== data.id));
      } else {
        setReminds((prev) =>
          prev.map((remind) => {
            if (remind.id === data.id) {
              return { ...remind, ...data };
            }
            return remind;
          })
        );
      }

      toast.success("Successfully changed");
    } catch (error) {
      toast.error("No Changes Made");
      console.log(error);
    }
  };

  const getCompletedReminds = async (cur, timeRange) => {
    try {
      await axios
        .get(`/completed`, {
          params: {
            cursor: cur !== 0 ? cursor : 0,
            limit: limit,
            start: moment(timeRange[0]).format("YYYY-MM-DDTHH:MM:SS"),
            end: moment(timeRange[1]).format("YYYY-MM-DDTHH:MM:SS"),
          },
        })
        .then(({ data }) => {
          if (cur === 0) {
            setReminds(data.todos);
          } else {
            setReminds((prev) =>
              JSON.stringify(prev) === JSON.stringify(data.todos)
                ? prev
                : [...prev, ...data.todos]
            );
          }
          checkForMoreReminds(data.pageInfo.nextCursor);
          setCursor(data.pageInfo.nextCursor);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentReminds = async (cur) => {
    try {
      await axios
        .get(`/current`, {
          params: {
            cursor: cur !== 0 ? cursor : 0,
            limit: limit,
          },
        })
        .then(({ data }) => {
          setReminds((prev) =>
            JSON.stringify(prev) === JSON.stringify(data.todos)
              ? prev
              : [...prev, ...data.todos]
          );
          checkForMoreReminds(data.pageInfo.nextCursor);
          setCursor(data.pageInfo.nextCursor);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRemind = async (id) => {
    try {
      await axios.delete(`/remind/${id}`);
      setReminds(reminds.filter((remind) => remind.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const onSortReminds = (type) => {
    switch (type) {
      case "deadline":
        setReminds(
          reminds
            .slice()
            .sort((a, b) => moment(a.deadline_at).diff(moment(b.deadline_at)))
        );
        break;
      case "created":
        setReminds(
          reminds
            .slice()
            .sort((a, b) => moment(a.created_at).diff(moment(b.created_at)))
        );
        break;
      default:
        return;
    }
  };

  const checkForMoreReminds = useCallback((cursor) => {
    setNoMoreReminds(false);
    if (cursor === 0) {
      setNoMoreReminds(true);
    }
  }, []);

  return (
    <Context.Provider value={[context, setContext]}>
      <div className={styles.bg_container}>
        <Header />
        <div className="container">
          <PageTitle>Reminder GO</PageTitle>
          <div className={styles.app__wrapper}>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    createRemind={createRemind}
                    getAllReminds={getAllReminds}
                    getCompletedReminds={getCompletedReminds}
                    getCurrentReminds={getCurrentReminds}
                    onSortReminds={onSortReminds}
                    reminds={reminds}
                    updateRemind={updateRemind}
                    deleteRemind={deleteRemind}
                    noMoreReminds={noMoreReminds}
                    cursor={cursor}
                  />
                }
              />
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
    </Context.Provider>
  );
}

export default App;
