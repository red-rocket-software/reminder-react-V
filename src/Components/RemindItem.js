import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getClasses } from "../utils/getClasses";
import styles from "../styles/modules/remindItem.module.scss";
import { MdDelete, MdEdit } from "react-icons/md";
import CheckButton from "./CheckButton";
import RemindModal from "./RemindModal";
import toast from "react-hot-toast";
import * as moment from "moment";

// redux
import { useDispatch } from "react-redux";
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

function RemindItem({ remind }) {
  const [checked, setChecked] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const dispatch = useDispatch();

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
      toast.success("Todo Delete Successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }, [dispatch, remind.id]);
  
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
  }, [checked, dispatch, remind.id]);

  return (
    <>
      <motion.div
        variants={child}
        className={getClasses([
          styles.item,
          new Date(remind.deadline_at) < new Date() && styles.item_failed,
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
              created: {moment(remind.created_at).format("DD-MM-YYYY hh:mm:ss")}
            </p>

            <p className={styles.time}>
              deadline:{" "}
              {moment(remind.deadline_at).format("DD-MM-YYYY hh:mm:ss")}
            </p>

            <p className={styles.time}>
              {remind.completed &&
                "finished at: " +
                  moment(remind.finished_at).format("DD-MM-YYYY hh:mm:00")}
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
          <div
            className={styles.icon}
            onClick={handleUpdate}
            role="button"
            onKeyDown={handleUpdate}
            tabIndex={0}
          >
            <MdEdit />
          </div>
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
