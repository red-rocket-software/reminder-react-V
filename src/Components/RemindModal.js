import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/modules/modal.module.scss";
import { MdOutlineClose, MdOutlineNotificationsActive } from "react-icons/md";
import Button from "./Button";
import NotificationForm from "./NotificationForm";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import * as moment from "moment";
import DateTimePicker from "react-datetime-picker";
import { getClasses } from "../utils/getClasses";

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
  const [deadline_notify, setDeadline_notify] = useState(false);
  const [notificationArray, setNotificationArray] = useState([]);

  const getNotificationArrayFromRemind = useCallback((reminds) => {
    const filteredReminds = reminds.filter(
      (remind) => remind !== "0001-01-01T00:00:00Z"
    );
    console.log(filteredReminds);
    return filteredReminds;
  }, []);

  useEffect(() => {
    if (type === "update") {
      setDescription(remind.description);
      setCompleted(remind.completed);
      setDeadline_at(new Date(remind.deadline_at));
      setDeadline_notify(remind.deadline_notify);
      setNotificationArray([
        ...getNotificationArrayFromRemind(remind.notify_period),
      ]);
    } else if (type === "add") {
      setDescription("");
      setCompleted(false);
      setDeadline_notify(false);
      setNotificationArray([]);
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
            created_at: moment(new Date()).format("DD.MM.YYYY, HH:mm:ss"),
            deadline_at: moment(deadline_at).format("YYYY-MM-DDTHH:mm:ssZ"),
            deadline_notify: deadline_notify,
            notify_period: notificationArray,
          });
          setDeadline_at(new Date());
          setDeadline_notify(false);
          setModalOpen(false);
        }
        if (type === "update") {
          if (
            remind.description !== description ||
            remind.completed !== completed ||
            remind.deadline_at !== deadline_at ||
            remind.deadline_notify !== deadline_notify
          ) {
            onUpdate({
              id: remind.id,
              remind: {
                ...remind,
                description,
                deadline_at,
                deadline_notify,
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
      deadline_notify,
      notificationArray,
      onCreate,
      onUpdate,
      remind,
      setModalOpen,
      type,
    ]
  );

  const changeNotificationStatus = useCallback(() => {
    setDeadline_notify(true);
  }, []);

  //^ actions on press ESC and click on overlay
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
  //^

  const onAddNotification = useCallback(() => {
    setNotificationArray((prev) => [...prev, moment()]);
  }, []);

  const setNotificationValueInArray = useCallback(
    (id, timeValue) => {
      const notificationArrayCopy = [...notificationArray];
      notificationArrayCopy[id] = moment(timeValue).format(
        "YYYY-MM-DDTHH:mm:ssZ"
      );
      setNotificationArray([...notificationArrayCopy]);
    },
    [notificationArray]
  );

  const deleteNotificationValueInArray = useCallback(
    (id) => {
      setNotificationArray([
        ...notificationArray.filter((_, index) => index !== id),
      ]);
    },
    [notificationArray]
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

              {/* notification section */}
              <div
                className={getClasses([
                  styles.notification,
                  notificationArray.length !== 0 && styles.notification__db,
                ])}
              >
                <div className={styles.notification__contnent}>
                  <MdOutlineNotificationsActive
                    color="#2f303d"
                    size="2em"
                    className={
                      notificationArray.length !== 0 &&
                      styles.notification__icon
                    }
                  />

                  <div className={styles.notification__itemsList}>
                    {notificationArray.map((_, index) => {
                      return (
                        <NotificationForm
                          key={index}
                          itemID={index}
                          deadline={deadline_at}
                          onDelete={deleteNotificationValueInArray}
                          onValue={setNotificationValueInArray}
                        />
                      );
                    })}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="none"
                  // disabled={moment(deadline_at).diff(moment(), "minutes") < 1}
                  onClick={onAddNotification}
                >
                  <p className={styles.notification__title}>Add notification</p>
                </Button>
              </div>
              {/* <label className={styles.checkbox_control}>
                <input
                  type="checkbox"
                  name="checkbox"
                  checked={deadline_notify}
                  onChange={changeNotificationStatus}
                />
                <p>Notify me two hours before the deadline</p>
              </label> */}

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
