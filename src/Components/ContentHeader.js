import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/modules/app.module.scss";
import Button, { SelectButton } from "./Button";
import RemindModal from "./RemindModal";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import moment from "moment";
import toast from "react-hot-toast";

//  redux
import { useSelector, useDispatch } from "react-redux";
import {
  createRemind,
  fetchReminds,
  updateFilter,
  updateTimeRange,
  sortReminds,
  resetItems
} from "../store/slices/remindSlice";

function ContentHeader() {
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const { page } = useSelector((state) => state.reminds.pageInfo);
  const { filter, timeRange } = useSelector((state) => state.reminds);

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
      dispatch(resetItems())
      dispatch(updateTimeRange([e[0].getTime(), e[1].getTime()]));
    },
    [dispatch]
  );

  const onSort = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(sortReminds(e.target.value));
    },
    [dispatch]
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
            start: moment(timeRange[0]).format("YYYY-MM-DDTHH:MM:00"),
            end: moment(timeRange[1]).format("YYYY-MM-DDTHH:MM:00"),
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

      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }
  }, [dispatch, filter, page.limit, timeRange]);

  return (
    <div className={styles.appHeader}>
      <Button variant="primary" onClick={() => setModalOpen(true)}>
        Add Remind
      </Button>

      <div className={styles.header_button}>
        {filter === "completed" && (
          <DateTimeRangePicker
            className={styles.timeRange}
            onChange={onTimeRange}
            value={[new Date(timeRange[0]), new Date(timeRange[1])]}
            clearIcon={null}
          />
        )}

        {filter === "current" && (
          <div>
            <SelectButton id="filter" onChange={onSort}>
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
