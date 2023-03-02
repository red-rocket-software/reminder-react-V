import React from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/modules/oauth.module.scss";
import {
  AiFillGithub,
  AiFillGoogleCircle,
  AiFillLinkedin,
} from "react-icons/ai";

import { getLinkedinURL } from "../utils/oauth/getLinkedinURL";
import { getGithubURL } from "../utils/oauth/getGithubURL";
import { getGoogleURL } from "../utils/oauth/getGoogleURL";

export default function Oauth() {
  const location = useLocation();

  const from = location.state?.from.pathname || "/";

  return (
    <div className={styles.oauth}>
      <ul className={styles.oauthList}>
        <li key="google">
          <a href={getGoogleURL(from)} role="button">
            <AiFillGoogleCircle size="4em" className={styles.icon} />
          </a>
        </li>
        <li key="github">
          <a href={getGithubURL(from)} role="button">
            <AiFillGithub size="4em" className={styles.icon} />
          </a>
        </li>
        <li key="linkedin">
          <a href={getLinkedinURL(from)} role="button">
            <AiFillLinkedin size="4em" className={styles.icon} />
          </a>
        </li>
      </ul>
    </div>
  );
}
