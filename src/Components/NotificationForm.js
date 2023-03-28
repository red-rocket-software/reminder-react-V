import React, { useState, useCallback, useEffect } from "react";
import { SelectButton } from "./Button";
import moment from "moment";
import { MdClose } from "react-icons/md";
import styles from "../styles/modules/notificationForm.module.scss";

const NotificationForm = ({
  period_item,
  deadline,
  itemID,
  onValue,
  onDelete,
  userNotifyStatusPeriod,
}) => {
  const [timeValue, setTimeValue] = useState(1);
  const [timeType, setTimeType] = useState("minutes");
  const [maxTimeValue, setMaxTimeValue] = useState(null);

  console.log(userNotifyStatusPeriod);

  useEffect(() => {
    if (period_item) {
      const timeDiffInMinutes = moment(deadline).diff(
        moment(period_item),
        "minutes"
      );

      if (timeDiffInMinutes > 59) {
        const timeDiffInHours = moment(deadline).diff(
          moment(period_item),
          "hours"
        );

        if (timeDiffInHours > 23) {
          setTimeValue(moment(deadline).diff(moment(period_item), "days"));
          setTimeType("days");
          // setMaxTimeValue(moment(deadline).diff(moment(), "days"));
          setMaxTimeValue(userNotifyStatusPeriod);
          return;
        }

        setTimeValue(timeDiffInHours);
        setTimeType("hours");
        setMaxTimeValue(moment(deadline).diff(moment(), "hours"));

        return;
      }

      setTimeValue(timeDiffInMinutes);
      setTimeType("minutes");
      setMaxTimeValue(moment(deadline).diff(moment(), "minutes"));
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period_item]);

  useEffect(() => {
    setMaxTimeValue(moment(deadline).diff(moment(), timeType));
  }, [deadline, timeType]);

  const changeType = useCallback(
    (e) => {
      e.preventDefault();
      setTimeType(e.target.value);
      setMaxTimeValue(moment(deadline).diff(moment(), e.target.value));
      setTimeValue("1");
    },
    [deadline]
  );

  const changeTimeValue = useCallback(
    (e) => {
      e.preventDefault();
      if (e.target.value <= maxTimeValue) {
        setTimeValue(e.target.value);
        onValue(itemID, moment(deadline).subtract(e.target.value, timeType));
      }
    },
    [deadline, itemID, maxTimeValue, onValue, timeType]
  );

  const deleteNotification = useCallback(() => {
    onDelete(itemID);
  }, [itemID, onDelete]);

  return (
    <div className={styles.notification__item}>
      <input
        id="time-value"
        disabled={maxTimeValue === 0}
        min="1"
        value={timeValue}
        max={maxTimeValue}
        placeholder="SET PERIOD"
        type="number"
        onChange={changeTimeValue}
        className={styles.notification__value}
      />

      <SelectButton id="time-type" onChange={changeType} value={timeType}>
        <option value="minutes" key="mins">
          minutes
        </option>

        {/* we render "hours" option if it possible to choose more than 0 hours before deadline */}
        {moment(deadline).diff(moment(), "hours") > 0 && (
          <option value="hours" key="hours">
            hours
          </option>
        )}

        {/* we render "days" option if it possible to choose more than 0 days before deadline */}
        {moment(deadline).diff(moment(), "days") > 0 && (
          <option value="days" key="days">
            days
          </option>
        )}
      </SelectButton>

      <button
        className={styles.button__delete}
        type="button"
        onClick={deleteNotification}
      >
        <MdClose size="2rem" />
      </button>
    </div>
  );
};

export default NotificationForm;
