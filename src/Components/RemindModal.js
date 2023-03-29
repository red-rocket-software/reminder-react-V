import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/modules/modal.module.scss";
import { MdOutlineClose, MdOutlineNotificationsActive } from "react-icons/md";
import {
  onCreate_created_at,
  onCreate_deadline_at,
  onCreate_deadline_at_noZone,
  transformFromStringToDate,
  noZone,
} from "../utils/time";
import Button from "./Button";
import NotificationForm from "./NotificationForm";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import * as moment from "moment";
import DateTimePicker from "react-datetime-picker";
import { getClasses } from "../utils/getClasses";
import { useSelector } from "react-redux";

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
  const [notify_period, setNotify_period] = useState([]);

  const { notifyStatus, period } = useSelector((state) => state.user);

  // a function that does not skip array elements of type "0001-01-01T00:00:00Z"
  const getNotificationArrayFromRemind = useCallback((reminds) => {
    const filteredReminds = reminds?.reduce((acc, remind) => {
      if (remind !== "0001-01-01T00:00:00Z") {
        acc.push(
          new Date(moment.utc(remind).format(onCreate_deadline_at_noZone))
        );
      }
      return acc;
    }, []);
    return filteredReminds ? filteredReminds : [];
  }, []);

  // load initial values to state
  useEffect(() => {
    if (type === "update") {
      setDescription(remind.description);
      setCompleted(remind.completed);
      setDeadline_at(
        new Date(
          moment.utc(remind.deadline_at).format(onCreate_deadline_at_noZone)
        )
      );
      setDeadline_notify(remind.deadline_notify);
      setNotify_period([
        ...getNotificationArrayFromRemind(remind.notify_period),
      ]);
    } else if (type === "add") {
      setDescription("");
      setCompleted(false);
      setDeadline_notify(false);
      setNotify_period([]);
    }
  }, [getNotificationArrayFromRemind, modalOpen, remind, type]);

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
            created_at: moment(new Date()).format(onCreate_created_at),
            deadline_at: moment(deadline_at).format(onCreate_deadline_at),
            deadline_notify: deadline_notify,
            notify_period: notify_period,
          });
          setDeadline_at(new Date());
          setDeadline_notify(false);
          setModalOpen(false);
        }

        if (type === "update") {
          if (
            remind.description !== description ||
            remind.completed !== completed ||
            new Date(
              moment.utc(remind.deadline_at).format(onCreate_deadline_at_noZone)
            ).getTime() !== deadline_at.getTime() ||
            remind.deadline_notify !== deadline_notify ||
            JSON.stringify(
              getNotificationArrayFromRemind(remind.notify_period)
            ) !== JSON.stringify(notify_period)
          ) {
            onUpdate({
              id: remind.id,
              remind: {
                ...remind,
                description,
                finished_at: null,
                deadline_at: `${moment(deadline_at).format(
                  onCreate_deadline_at_noZone
                )}Z`,
                deadline_notify,
                notify_period: notify_period.map(
                  (notify) =>
                    `${moment(notify).format(onCreate_deadline_at_noZone)}Z`
                ),
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
      description,
      deadline_at,
      type,
      setModalOpen,
      onCreate,
      deadline_notify,
      notify_period,
      remind,
      completed,
      getNotificationArrayFromRemind,
      onUpdate,
    ]
  );

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

  //^ notification handle functions
  const onAddNotification = useCallback(() => {
    setDeadline_notify(true);
    setNotify_period((prev) => [...prev, ""]);
  }, []);

  const setNotificationValueInArray = useCallback(
    (id, timeValue) => {
      const notificationArrayCopy = [...notify_period];
      notificationArrayCopy[id] =
        moment(timeValue).format(onCreate_deadline_at);
      setNotify_period([...notificationArrayCopy]);
    },
    [notify_period]
  );
  //^ notification handle functions

  const deleteNotificationValueInArray = useCallback(
    (id) => {
      setNotify_period([...notify_period.filter((_, index) => index !== id)]);
    },
    [notify_period]
  );

  const onDeadlineChange = useCallback(
    (e) => {
      setNotify_period((prev) =>
        prev.map((notify) => {
          return moment(e)
            .subtract(
              moment(deadline_at).diff(moment(notify), "minutes"),
              "minutes"
            )
            .format(onCreate_deadline_at);
        })
      );
      setDeadline_at(e);
    },
    [deadline_at]
  );

  console.log(
    "deadline: ",
    // deadline_at
    transformFromStringToDate(moment.utc(deadline_at).format(noZone))
  );
  console.log("now: ", transformFromStringToDate(moment().format(noZone)));

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
                onChange={onDeadlineChange}
                value={deadline_at}
              />

              {/* notification section */}

              {notifyStatus === "true" &&
              deadline_at
               > transformFromStringToDate(moment().format(noZone)) &&
              notifyStatus ? (
                <div
                  className={getClasses([
                    styles.notification,
                    notify_period.length !== 0 && styles.notification__db,
                  ])}
                >
                  <div className={styles.notification__contnent}>
                    <MdOutlineNotificationsActive
                      color="#2f303d"
                      size="2em"
                      className={
                        notify_period.length !== 0 && styles.notification__icon
                      }
                    />

                    <div className={styles.notification__itemsList}>
                      {notify_period.map((item, index) => {
                        return (
                          <NotificationForm
                            key={index}
                            itemID={index}
                            deadline={moment(deadline_at).format(
                              onCreate_deadline_at
                            )}
                            period_item={item}
                            onDelete={deleteNotificationValueInArray}
                            onValue={setNotificationValueInArray}
                            userNotifyStatusPeriod={period}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="none"
                    onClick={onAddNotification}
                  >
                    <p className={styles.notification__title}>
                      Add notification
                    </p>
                  </Button>
                </div>
              ) : (
                <></>
              )}

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
