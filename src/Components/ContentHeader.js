import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/modules/app.module.scss";
import Button, { SelectButton } from "./Button";
import RemindModal from "./RemindModal";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import moment from "moment";
import toast from "react-hot-toast";
import { onCreate_deadline_at_noZone } from "../utils/time";

//  redux
import { useSelector, useDispatch } from "react-redux";
import {
  createRemind,
  fetchReminds,
  updateFilter,
  updateTimeRange,
  sortReminds,
  resetItems,
} from "../store/slices/remindSlice";

function ContentHeader() {
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  const { filter, timeRange } = useSelector((state) => state.reminds);

  const onCreateRemind = 
    async (data) => {
      try {
        const remind = await dispatch(createRemind(data))
        if(remind.payload.code){
          toast.error(remind.payload.message);
        }else {
          toast.success("Remind Added Successfully");
        }
      } catch (error) {
        toast.error("Failed To Add Remind");
      }
    };


  const updatedFilter = useCallback(
    (e) => {
      dispatch(updateFilter(e.target.value));
    },
    [dispatch]
  );

  const onTimeRange = useCallback(
    (e) => {
      dispatch(resetItems());
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
            limit: 5,
          })
        );
        break;
      case "completed":
        dispatch(
          fetchReminds({
            listParam: "completed",
            cursor: 0,
            limit: 5,
            start: moment(timeRange[0]).format(onCreate_deadline_at_noZone),
            end: moment(timeRange[1]).format(onCreate_deadline_at_noZone),
          })
        );

        break;
      case "current":
        dispatch(
          fetchReminds({
            listParam: "current",
            cursor: 0,
            limit: 5,
          })
        );

      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }
  }, [dispatch, filter, timeRange]);

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
