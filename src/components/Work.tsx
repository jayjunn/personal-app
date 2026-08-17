'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../app/styles/Work.module.css';
import { motion } from 'framer-motion';

type WorkProps = {
  name: string;
  img: string;
  description: string;
  stacks: string[];
  link: string;
  company?: string;
  priority?: boolean;
};

const Work = (props: WorkProps) => {
  const { name, img, description, stacks, link, company, priority = false } = props;

  return (
    <motion.div
      className={styles.project__container}
      id={company ? company.toLowerCase().replace(/\s+/g, '-') : name.toLowerCase().replace(/\s+/g, '-')}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}>
      <div className={styles.project__name}>
        <span>{name}</span>
        {company && <span className={styles.project__company}>{company}</span>}
      </div>

      <a href={link} target="_blank" rel="noreferrer" className={styles.image__link} aria-label={name}>
        <div className={styles.project__img__container}>
          <Image
            src={img}
            alt={`${name} logo`}
            fill
            priority={priority}
            unoptimized={true}
            className={styles.project__image}
            sizes="(max-width: 768px) 100vw, 450px"
          />
        </div>
      </a>

      <div className={styles.project__details}>
        <p className={styles.project__des}>{description}</p>
        <div className={styles.project__stacks}>
          {stacks.map((stack, index) => (
            <span key={`work-stack-${name}-${stack}-${index}`} className={styles.stack__item}>
              {stack}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Work;
