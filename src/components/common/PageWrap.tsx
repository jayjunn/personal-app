import React from 'react';
import styles from '../../app/styles/PageWrap.module.css';
import Image from 'next/image';
import anglesRight from '../../../public/image/anglesRight.svg';

interface IPageWrap {
  title: string;
  children: React.ReactNode;
}

export default function PageWrap({ title, children }: IPageWrap) {
  return (
    <section className={`${styles.container} h-min`}>
      <div className={styles.header} id="experiences">
        <Image className={styles.arrow} src={anglesRight} alt="icon" width="40" height="40" />
        <h4 className={styles.title}>{title}</h4>
      </div>
      {children}
    </section>
  );
}
