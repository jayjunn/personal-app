import React from "react";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import linkedin from "../public/image/linkedin.svg";
import github from "../public/image/github.svg";
import envelope from "../public/image/envelope.svg";
import Link from "next/link";

const Header = () => (
  <header>
    <section>
      <div className={styles.header}>
        <div className={styles.name__container}>
          <h1 className={styles.first__name}>YOUNGGEUN</h1>
          <h1>JUN</h1>
        </div>
        <div className={styles.role_container}>
          <h1 className={styles.front}>FRONT-END</h1>
          <h1>DEVELOPER</h1>
        </div>
      </div>
    </section>

    <section className={styles.second__header}>
      <div className={styles.contact}>
        <span className={styles.find__me}>FIND ME</span>
      </div>
      <div className={styles.find__arrows}>
        <span> {`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`}</span>
      </div>
      <ul className={styles.socials}>
        <li className={styles.social}>
          <Link href="https://github.com/jayjunn">
            <a target="_blank">
              <Image
                className={styles.social}
                src={github} //
                alt="home"
                width="40px"
                height="40px"
              />
            </a>
          </Link>
        </li>
        <li className={styles.social}>
          <Link href="https://www.linkedin.com/in/younggeun">
            <a target="_blank">
              <Image
                className={styles.social}
                src={linkedin}
                alt="home"
                width="40px"
                height="40px"
              />
            </a>
          </Link>
        </li>
        <li className={styles.email}>
          <Link href="mailto:jayjunn@outlook.com">
            <a>
              <Image
                className={styles.social}
                src={envelope}
                alt="home"
                width="40px"
                height="40px"
              />
            </a>
          </Link>
        </li>
      </ul>
    </section>
  </header>
);

export default Header;
