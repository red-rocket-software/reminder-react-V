import React, { useCallback, useState, useEffect } from "react";
import styles from "../styles/modules/drawer.module.scss";
import { MdClose } from "react-icons/md";
import Button, { SelectButton } from "./Button";
import { useSelector } from "react-redux";
import axios from "../utils/axios.js";

function ConfigDrawer({ setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const [checkedStatus, setCheckedStatus] = useState(user.notification);

  // const handleCheckNotify = useCallback(async () => {
  //   try {
  //     await axios.put(
  //       `/user/${user.id}`,
  //       { notification: !checkedStatus },
  //       { withCredentials: true }
  //     );
  //     setCheckedStatus(!checkedStatus);
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   }
  // }, [checkedStatus, user.id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        document.removeEventListener("keydown", handleKeyDown);
        setOpen();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setOpen]);

  const onOverlayClick = useCallback(
    (event) => {
      if (event.target.id === "overlay") {
        setOpen();
      }
    },
    [setOpen]
  );

  return (
    <div id="overlay" className={styles.overlay} onClick={onOverlayClick}>
      <div className={styles.drawer}>
        <div className={styles.drawer_header}>
          <h2 className={styles.header}>Configuration</h2>
          <div className={styles.close} onClick={setOpen}>
            <MdClose />
          </div>
        </div>

        <div className={styles.drawer_content}>
          <div className={styles.config}>
            <label htmlFor="checkbox" className={styles.customSelect}>
              <p>
                How many days before the deadline do you want to be notified?
              </p>
              <SelectButton id="notification" onChange={() => {}}>
                <option value="disable" key="disable">
                  Disable notifications
                </option>
                <option value="1" key="1">
                  1
                </option>
                <option value="2" key="2">
                  2
                </option>
                <option value="3" key="3">
                  3
                </option>
              </SelectButton>
            </label>
            <Button variant="primary">Accept</Button>
          </div>

          <div className={styles.danger_zone}>
            <p>DANGER ZONE</p>
            <Button variant="danger_red">Remove my account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigDrawer;
