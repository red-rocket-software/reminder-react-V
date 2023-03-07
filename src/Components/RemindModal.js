import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/modules/modal.module.scss";
import { MdOutlineClose } from "react-icons/md";
import Button from "./Button";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import * as moment from "moment";
import DateTimePicker from "react-datetime-picker";

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

  useEffect(() => {
    if (type === "update") {
      setDescription(remind.description);
      setCompleted(remind.completed);
      setDeadline_at(new Date(remind.deadline_at));
    } else if (type === "add") {
      setDescription("");
      setCompleted(false);
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
            created_at: moment(new Date()).format("DD.MM.YYYY, hh:mm:ss"),
            deadline_at: moment(deadline_at).format("YYYY-MM-DDThh:mm"),
          });
          setDeadline_at(new Date());
          setModalOpen(false);
        }
        if (type === "update") {
          if (
            remind.description !== description ||
            remind.completed !== completed ||
            remind.deadline_at !== deadline_at
          ) {
            onUpdate({
              id: remind.id,
              remind: { ...remind, description, deadline_at },
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
      onCreate,
      onUpdate,
      remind,
      setModalOpen,
      type,
    ]
  );
  
  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
