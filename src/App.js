import React, { useState, useEffect, useCallback, useContext } from "react";
import { Toaster } from "react-hot-toast";
import PageTitle from "./Components/PageTitle";
import AppHeader from "./Components/AppHeader";
import AppContent from "./Components/AppContent";
import styles from "./styles/modules/app.module.scss";
import axios from "./utils/axios";
import moment from "moment";
import toast from "react-hot-toast";

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

  const createRemind = async (data) => {
    try {
      console.log(data);
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
            .sort(
              (a, b) =>
                moment(a.deadline_at, "YYYY-DD-MM").unix() -
                moment(b.deadline_at, "YYYY-DD-MM").unix()
            )
        );
        break;
      case "created":
        setReminds(
          reminds
            .slice()
            .sort(
              (a, b) =>
                moment(a.created_at, "YYYY-DD-MM").unix() -
                moment(b.created_at, "YYYY-DD-MM").unix()
            )
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
        <div className="container">
          <PageTitle>Reminder GO</PageTitle>
          <div className={styles.app__wrapper}>
            <AppHeader
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
