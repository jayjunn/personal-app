import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from '../app/styles/Header.module.css';
import linkedin from '../../public/image/linkedin.svg';
import github from '../../public/image/github.svg';
import envelope from '../../public/image/envelope.svg';

export default function ContactList() {
  return (
    <section className={styles.second__header}>
      <div className={styles.contact}>
        <span className={styles.find__me}>FIND ME</span>
      </div>
      <div className={styles.find__arrows}>
        <span> {`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`}</span>
      </div>
      <ul className={styles.socials}>
        <li className={styles.social}>
          <Link href="https://github.com/jayjunn" target="_blank">
            <Image
              className={styles.social}
              src={github}
              alt="github"
              width="40"
              height="40"
            />
          </Link>
        </li>
        <li className={styles.social}>
          <Link href="https://www.linkedin.com/in/younggeun" target="_blank">
            <Image className={styles.social} src={linkedin} alt="linkedin" width="40" height="40" />
          </Link>
        </li>
        <li className={styles.email}>
          <Link href="mailto:jayjunn@outlook.com">
            <Image className={styles.social} src={envelope} alt="email" width="40" height="40" />
          </Link>
        </li>
      </ul>
    </section>
  );
}
