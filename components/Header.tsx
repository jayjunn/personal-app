import React from "react";
import styles from "../styles/Header.module.css";

const Header = () => (
  <header className={styles.header}>
    <div className={styles.name__container}>
      <h1 className={styles.first__name}>YOUNGGEUN</h1>
      <h1>JUN</h1>
    </div>
    <div className={styles.role_container}>
      <h1 className={styles.front}>FRONTEND</h1>
      <h1>DEVELOPER</h1>
    </div>
  </header>
);

export default Header;
