import React from "react";
import styles from "../styles/modules/oauth.module.scss";
import {
  AiFillGithub,
  AiFillGoogleCircle,
  AiFillLinkedin,
} from "react-icons/ai";

export default function Oauth() {
  return (
    <div className={styles.oauth}>
      <ul className={styles.oauthList}>
        <li key="google">
          <AiFillGoogleCircle size="4em" className={styles.icon} />
        </li>
        <li key="github">
          <AiFillGithub size="4em" className={styles.icon} />
        </li>
        <li key="linkedin">
          <AiFillLinkedin size="4em" className={styles.icon} />
        </li>
      </ul>
    </div>
  );
}
