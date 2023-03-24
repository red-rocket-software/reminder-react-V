import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getClasses } from "../utils/getClasses";
import { transformFromStringToDate, noZone } from "../utils/time";
import styles from "../styles/modules/remindItem.module.scss";
import { MdDelete, MdEdit } from "react-icons/md";
import CheckButton from "./CheckButton";
import RemindModal from "./RemindModal";
import toast from "react-hot-toast";
import * as moment from "moment";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  removeRemind,
  updateRemind,
  upateRemindStatus,
} from "../store/slices/remindSlice";

//  inline styles
const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function RemindItem({ remind, loadMoreReminds }) {
  const [checked, setChecked] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { filter, noMoreReminds } = useSelector((state) => state.reminds);
  const { nextCursor } = useSelector((state) => state.reminds.pageInfo);

  useEffect(() => {
    if (remind.completed === "true" || remind.completed === true) {
      setChecked(true);
    } else if (remind.completed === "false" || remind.completed === false) {
      setChecked(false);
    }
  }, [remind]);

  const handleDelete = useCallback(async () => {
    try {
      await dispatch(removeRemind(remind.id));

      // we download one reminder instead of the deleted one
      if (!noMoreReminds) {
        loadMoreReminds(filter, 1, nextCursor);
      }
      toast.success("Todo Delete Successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }, [dispatch, filter, loadMoreReminds, nextCursor, noMoreReminds, remind.id]);

  const handleUpdate = () => {
    setUpdateModalOpen(true);
  };

  const onUpdateRemind = useCallback(
    (data) => {
      try {
        dispatch(updateRemind(data));
        toast.success("Remind Updated Successfully");
      } catch (error) {
        toast.error("Failed To Update Remind");
        console.log(error);
      }
    },
    [dispatch]
  );

  const handleCheck = useCallback(() => {
    dispatch(upateRemindStatus({ id: remind.id, status: !checked }));

    // we download one reminder instead of the updated one
    if (!noMoreReminds && filter !== "all") {
      loadMoreReminds(filter, 1, nextCursor);
    }
  }, [
    checked,
    dispatch,
    filter,
    loadMoreReminds,
    nextCursor,
    noMoreReminds,
    remind.id,
  ]);
  return (
    <>
      <motion.div
        variants={child}
        className={getClasses([
          styles.item,
          transformFromStringToDate(
            moment.utc(remind.deadline_at).format(noZone)
          ) < transformFromStringToDate(moment().format(noZone)) &&
            styles.item_failed,
          checked && styles.item_finished,
        ])}
      >
        <div className={styles.todoDetails}>
          <div className={styles.todoDescriptionBox}>
            <CheckButton checked={checked} handleCheck={handleCheck} />

            <p
              className={getClasses([
                styles.todoText,
                checked === true && styles["todoText--completed"],
              ])}
            >
              {remind.description}
            </p>
          </div>
          <div className={styles.texts}>
            <p className={styles.time}>
              created:{" "}
              {remind.created_at
                ? moment.utc(remind.created_at).format(noZone)
                : moment().format(noZone)}
            </p>

            <p className={styles.time}>
              deadline: {moment.utc(remind.deadline_at).format(noZone)}
            </p>

            <p className={styles.time}>
              {remind.completed &&
                "finished at: " +
                  (remind.finished_at
                    ? moment.utc(remind.finished_at).format(noZone)
                    : moment().format(noZone))}
            </p>
          </div>
        </div>

        {/* actions */}
        <div className={styles.todoActions}>
          <div
            className={styles.icon}
            onClick={() => handleDelete()}
            role="button"
            onKeyDown={handleDelete}
            tabIndex={0}
          >
            <MdDelete />
          </div>

          {!checked && (
            <div
              className={styles.icon}
              onClick={handleUpdate}
              role="button"
              onKeyDown={handleUpdate}
              tabIndex={0}
            >
              <MdEdit />
            </div>
          )}
        </div>
      </motion.div>

      <RemindModal
        type="update"
        remind={remind}
        onUpdate={onUpdateRemind}
        modalOpen={updateModalOpen}
        setModalOpen={setUpdateModalOpen}
      />
    </>
  );
}

export default RemindItem;
