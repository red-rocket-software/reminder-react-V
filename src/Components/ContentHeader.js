/* eslint-disable no-fallthrough */
import React, { useEffect, useState, useContext, useCallback } from "react";
import styles from "../styles/modules/app.module.scss";
import Button, { SelectButton } from "./Button";
import RemindModal from "./RemindModal";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import moment from "moment";
import toast from "react-hot-toast";

import { useSelector, useDispatch } from "react-redux";
import {
  createRemind,
  fetchReminds,
  updateFilter,
} from "../store/slices/remindSlice";

import Context from "../utils/context";

function ContentHeader({
  // onCreate,
  // onGetAll,
  onGetCompleted,
  onGetCurrent,
  onSort,
}) {
  const [context, setContext] = useContext(Context);
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const { page } = useSelector((state) => state.reminds.pageInfo);
  const { filter } = useSelector((state) => state.reminds);

  const onCreateRemind = useCallback(
    (data) => {
      try {
        dispatch(createRemind(data));
        toast.success("Remind Added Successfully");
      } catch (error) {
        toast.error("Failed To Add Remind");
        console.log(error);
      }
    },
    [dispatch]
  );

  const updatedFilter = useCallback(
    (e) => {
      dispatch(updateFilter(e.target.value));
    },
    [dispatch]
  );

  const onTimeRange = useCallback(
    (e) => {
      setContext((prevState) => ({ ...prevState, timeRange: e }));
    },
    [setContext]
  );

  useEffect(() => {
    switch (filter) {
      case "all":
        dispatch(
          fetchReminds({
            listParam: "remind",
            cursor: 0,
            limit: page.limit,
          })
        );
        break;
      case "completed":
        dispatch(
          fetchReminds({
            listParam: "completed",
            cursor: 0,
            limit: page.limit,
            start: moment(context.timeRange[0]).format("YYYY-MM-DDTHH:MM:SS"),
            end: moment(context.timeRange[1]).format("YYYY-MM-DDTHH:MM:SS"),
          })
        );

        break;
      case "current":
        dispatch(
          fetchReminds({
            listParam: "current",
            cursor: 0,
            limit: page.limit,
          })
        );

      default:
        break;
    }
  }, [filter, context.timeRange]);

  return (
    <div className={styles.appHeader}>
      <Button variant="primary" onClick={() => setModalOpen(true)}>
        Add Remind
      </Button>

      <div className={styles.header_button}>
        {context.filter === "completed" && (
          <DateTimeRangePicker
            className={styles.timeRange}
            onChange={onTimeRange}
            value={context.timeRange}
            clearIcon={null}
          />
        )}

        {context.filter === "current" && (
          <div>
            <SelectButton
              id="filter"
              onChange={(e) => {
                onSort(e.target.value);
              }}
            >
              <option value="deadline" key="deadline">
                Deadline
              </option>
              <option value="created" key="created">
                Created
              </option>
            </SelectButton>
          </div>
        )}

        <SelectButton id="status" onChange={updatedFilter}>
          <option key="all" value="all">
            All
          </option>
          <option key="completed" value="completed">
            Completed
          </option>
          <option key="current" value="current">
            Current
          </option>
        </SelectButton>
      </div>

      <RemindModal
        type="add"
        onCreate={onCreateRemind}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </div>
  );
}

export default ContentHeader;
