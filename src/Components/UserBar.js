import React from 'react'
import styles from "../styles/modules/userbar.module.scss";


function UserBar({avatarUrl, name, firstLeter}) {
    return (
        <div className={styles.root}>
            <div className={styles.avatarWrap}>
                {avatarUrl 
                ? <img className={styles.avatar} src={avatarUrl} alt={name} 
                />
                : <p className={styles.firstLeter}>{firstLeter}</p>}
          
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>Pavel</span>
          </div>
        </div>
      );
}

export default UserBar