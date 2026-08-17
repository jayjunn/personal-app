import React from 'react';
import styles from '../../app/styles/PageWrap.module.css';
import Image from 'next/image';
import Link from 'next/link';
import anglesRight from '../../../public/image/anglesRight.svg';

interface IPageWrap {
  title: string;
  moreLink?: string;
  moreText?: string;
  children: React.ReactNode;
}

export default function PageWrap({ title, moreLink, moreText = 'VIEW ALL ➔', children }: IPageWrap) {
  return (
    <section className={`${styles.container} h-min`}>
      <div className={styles.header}>
        <div className={styles.header__left}>
          <Image className={styles.arrow} src={anglesRight} alt="icon" width="30" height="30" />
          <h2 className={styles.title}>{title}</h2>
        </div>
        {moreLink && (
          <Link href={moreLink} className={styles.more__link}>
            {moreText}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
