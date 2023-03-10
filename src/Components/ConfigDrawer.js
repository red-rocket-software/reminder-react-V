import React from 'react';
import styles from '../styles/modules/drawer.module.scss';
import {MdClose} from 'react-icons/md';
import { useSelector } from "react-redux";
import axios from "../utils/axios.js";

function ConfigDrawer({setOpen}) {

    const { user } = useSelector((state) => state.auth);
    const [checkedStatus, setCheckedStatus] = React.useState(user.notification)
    console.log(checkedStatus);

    const handleCheckNotify = async () => {
            try {
              await axios.put(
                `/user/${user.id}`,
                { notification: !checkedStatus },
                { withCredentials: true }
              );
              setCheckedStatus(!checkedStatus)
            } catch (error) {
              console.log(error);
              return error;
            }
      }

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        <h2>Configuration</h2>
        <label htmlFor="checkbox" className={styles.customCheckbox}>
            <input 
            type="checkbox" 
            id = "checkbox" 
            name='notify'
            className={styles.checkboxInput} 
            checked={checkedStatus} 
            onChange={handleCheckNotify}
            />
            <span></span>
            I want to recice notifications
        </label>
        <div className={styles.close} onClick={setOpen}><MdClose /></div >
      </div>
    </div>
  );
}

export default ConfigDrawer;
