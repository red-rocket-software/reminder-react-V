import React, { useCallback, useState, useEffect } from 'react';
import styles from '../styles/modules/drawer.module.scss';
import stylesSelect from '../styles/modules/button.module.scss';
import { MdClose } from 'react-icons/md';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { fetchDelete } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';
import { getClasses } from '../utils/getClasses';
import { updateNotification } from '../store/slices/userSlice';

function ConfigDrawer({ setOpen }) {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const [checkedStatus, setCheckedStatus] = useState(
    JSON.parse(localStorage.getItem('userNotifyStatus'))
  );
  const [period, setPeriod] = useState(
    JSON.parse(localStorage.getItem('userNotifyStatusPeriod'))
  );
  console.log(period);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const handleCheckNotify = useCallback(async () => {
      dispatch(updateNotification(user.id, period, checkedStatus))
    
      localStorage.setItem('userNotifyStatus', JSON.stringify(!checkedStatus));
      setCheckedStatus(!checkedStatus);
    
  }, [checkedStatus, user.id, period, dispatch]);

  const handleCheckNotifySelect = useCallback(
    async (e) => {
      try {
        await axios.put(
          `/user/${user.id}`,
          { period: Number(e.target.value) },
          { withCredentials: true }
        );
        localStorage.setItem('userNotifyStatusPeriod', JSON.stringify(Number(e.target.value)));
        setPeriod(e.target.value);
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    [checkedStatus, user.id, period]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        document.removeEventListener('keydown', handleKeyDown);
        setOpen();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setOpen]);

  const onOverlayClick = useCallback(
    (event) => {
      if (event.target.id === 'overlay') {
        setOpen();
      }
    },
    [setOpen]
  );

  const handleDelete = useCallback(async () => {
    try {
      dispatch(fetchDelete(user.id));
      localStorage.removeItem('userInfo');
      setOpen(false);
      navigator('/');
    } catch (error) {
      console.log(error);
      return error;
    }
  }, [dispatch, navigator, user?.id, setOpen]);

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
            <label className={styles.checkbox_control}>
              <input
                type="checkbox"
                name="checkbox"
                onChange={handleCheckNotify}
                checked={checkedStatus}
              />
              <p>I want to recieve notificatiom</p>
            </label>
            {checkedStatus && (
              <label htmlFor="checkbox" className={styles.customSelect}>
                <p>
                  How many days before the deadline do you want to be notified?
                  (by default 2 days)
                </p>
                <select
                  defaultValue={period}
                  className={getClasses([
                    stylesSelect.button,
                    stylesSelect.button__select,
                  ])}
                  id="notification"
                  onChange={(e) => handleCheckNotifySelect(e)}
                >
                  <option value="1" key="1">
                    1
                  </option>
                  <option value="2" key="2">
                    2
                  </option>
                  <option value="3" key="3">
                    3
                  </option>
                </select>
              </label>
            )}
          </div>
          <div className={styles.danger_zone}>
            <p>DANGER ZONE</p>
            <Button variant="danger_red" onClick={handleDelete}>
              Remove my account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigDrawer;
