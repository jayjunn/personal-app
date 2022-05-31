import React from "react";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import linkedin from "../public/image/linkedin.svg";
import github from "../public/image/github.svg";
import envelope from "../public/image/envelope.svg";
import Link from "next/link";

const Header = () => (
  <div>
    <header>
      <div className={styles.header}>
        <div className={styles.name__container}>
          <h1 className={styles.first__name}>YOUNGGEUN</h1>
          <h1>JUN</h1>
        </div>
        <div className={styles.role_container}>
          <h1 className={styles.front}>FRONTEND</h1>
          <h1>DEVELOPER</h1>
        </div>
      </div>
    </header>

    <nav className={styles.second__header}>
      <section className={styles.contact}>
        <span className={styles.find__me}>FIND ME</span>
        <ul className={styles.socials}>
          <li>
            <Link href="https://github.com/jayjunn">
              <a target="_blank">
                <Image
                  src={github} //
                  alt="home"
                  width="40px"
                  height="40px"
                />
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://www.linkedin.com/in/younggeun">
              <a target="_blank">
                <Image src={linkedin} alt="home" width="40px" height="40px" />
              </a>
            </Link>
          </li>
          <li>
            <Link href="mailto:jayjunn@outlook.com">
              <a>
                <Image src={envelope} alt="home" width="40px" height="40px" />
              </a>
            </Link>
          </li>
        </ul>
      </section>
      <button className={styles.button}>DARK MODE</button>
    </nav>
  </div>
);

export default Header;
