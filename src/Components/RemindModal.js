import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/modules/modal.module.scss";
import { MdOutlineClose } from "react-icons/md";
import Button from "./Button";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import * as moment from "moment";
import DateTimePicker from "react-datetime-picker";
import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";

//  inline styles
const dropin = {
  hidden: {
    opacity: 0,
    transform: "scale(0.9)",
  },
  visible: {
    transform: "scale(1)",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    transform: "scale(0.9)",
    opacity: 0,
  },
};

function RemindModal({
  type,
  modalOpen,
  setModalOpen,
  remind,
  onCreate,
  onUpdate,
}) {
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [deadline_at, setDeadline_at] = useState(new Date());
  const [isCheckedNotification, setIsCheckedNotification] = useState(false);

  useEffect(() => {
    if (type === "update") {
      setDescription(remind.description);
      setCompleted(remind.completed);
      setDeadline_at(new Date(remind.deadline_at));
      setIsCheckedNotification(remind.deadline_notify);
    } else if (type === "add") {
      setDescription("");
      setCompleted(false);
      setIsCheckedNotification(false);
    }
  }, [modalOpen, remind, type]);

  const handleSumbit = useCallback(
    (e) => {
      e.preventDefault();
      if (description === "") {
        toast.error("Please enter a title.");
        return;
      }

      if (description && deadline_at) {
        if (type === "add") {
          onCreate({
            description: description,
            deadline_notify: isCheckedNotification,
            created_at: moment(new Date()).format("DD.MM.YYYY, HH:mm:ss"),
            deadline_at: moment(deadline_at).format("YYYY-MM-DDTHH:mm"),
          });
          setDeadline_at(new Date());
          setIsCheckedNotification(false);
          setModalOpen(false);
        }
        if (type === "update") {
          if (
            remind.description !== description ||
            remind.completed !== completed ||
            remind.deadline_at !== deadline_at ||
            remind.deadline_notify !== isCheckedNotification
          ) {
            onUpdate({
              id: remind.id,
              remind: {
                ...remind,
                description,
                deadline_at,
                deadline_notify: isCheckedNotification,
              },
            });
          } else {
            return;
          }
        }
        setModalOpen(false);
      }
    },
    [
      completed,
      deadline_at,
      description,
      isCheckedNotification,
      onCreate,
      onUpdate,
      remind,
      setModalOpen,
      type,
    ]
  );

  const changeNotificationStatus = useCallback(() => {
    setIsCheckedNotification((prev) => !prev);
  }, [isCheckedNotification]);

  // actions on press ESC and click on overlay
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        document.removeEventListener("keydown", handleKeyDown);
        setModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const onOverlayClick = useCallback(
    (event) => {
      if (event.target.id === "wrapper") {
        setModalOpen(false);
      }
    },
    [setModalOpen]
  );

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          id="wrapper"
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onOverlayClick}
        >
          <motion.div
            className={styles.container}
            variants={dropin}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.closeButton}
              onClick={() => setModalOpen(false)}
              onKeyDown={() => setModalOpen(false)}
              tabIndex={0}
              role="button"
              initial={{ top: 40, opacity: 0 }}
              animate={{ top: -10, opacity: 1 }}
              exit={{ top: 40, opacity: 0 }}
            >
              <MdOutlineClose />
            </motion.div>
            <form className={styles.form} onSubmit={(e) => handleSumbit(e)}>
              <h1 className={styles.formTitle}>
                {type === "update" ? "Update" : "add"} Remind
              </h1>

              {/* decsription */}
              <label htmlFor="description">
                Description
                <input
                  value={description}
                  type="text"
                  id="title"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>

              {/* deadline_at at */}
              <DateTimePicker
                className={styles.datePicker}
                id="deadlineAt"
                onChange={(e) => {
                  setDeadline_at(e);
                }}
                value={deadline_at}
              />

              <label className={styles.checkbox_control}>
                <input
                  // value={isCheckedNotification}
                  type="checkbox"
                  name="checkbox"
                  checked={isCheckedNotification}
                  onChange={changeNotificationStatus}
                />
                <p>Notify me two hours before the deadline</p>
              </label>

              <div className={styles.buttonContainer}>
                <Button type="submit" variant="primary">
                  {type === "update" ? "Update" : "Add"} Remind
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setModalOpen(false)}
                  onKeyDown={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RemindModal;
