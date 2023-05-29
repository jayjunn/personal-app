import React, { useState } from 'react';
import styles from '../styles/Experience.module.css';
import anglesRight from '../public/image/anglesRight.svg';
import Image from 'next/image';
import { faL } from '@fortawesome/free-solid-svg-icons';

export default function Experience() {
  const [isFolded, setIsFolded] = useState(false);
  const handleExperienceClick = (company: string) => {
    document.getElementById(`${company.toLocaleLowerCase()}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTitleClick = () => {
    setIsFolded(!isFolded);
  };

  return (
    <section className={styles.container}>
      <div className={styles.header} id="experiences" onClick={handleTitleClick}>
        <Image className={styles.arrow} src={anglesRight} alt="icon" width="40px" height="40px" />
        <h4 className={styles.title}>Experience</h4>
      </div>
      <ul className={`${styles.experience__list} ${isFolded ? styles.folded : styles.open}`}>
        {data.map(({ role, company, description }, index) => (
          <li className={styles.experience} key={index} onClick={() => handleExperienceClick(company)}>
            <div className={styles.experience__name}>
              <h5 className={styles.role}>{role},</h5>
              <h5>{company}</h5>
            </div>
            <ul className={styles.descriptions}>
              {description.map((item, index) => (
                <li className={styles.description} key={index}>
                  <p>- {item}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

const data = [
  {
    role: 'Font-end Developer',
    company: 'Blocko',
    description: [
      'Developed highly engaging user interfaces using React and TypeScript, resulting in a seamless UX.',
      'Implemented blockchain SaaS such as SilverMine and CCCV NFT.',
      'Implemented and delivered front-end data visualization.',
      'Played an integral part in the design and architecture process, collaborating closely with stakeholders.',
      'Based on the scrum methodology, experienced the Agile development process by developing the product in a 2-week sprint.',
    ],
  },
  {
    role: 'Font-end Developer',
    company: 'Glue',
    description: [
      ' Worked in an agile team of 5 developers using Git workflow 2021',
      'Developed the front-end structure including app flow, logic and UX/UI Collaborated with back-end team on database structure and API design',
      'Implemented user authentication Auth0',
    ],
  },
  {
    role: 'Digital Marketing Coordinator',
    company: 'COS',
    description: [
      'Optimize localization of social media activities in local markets',
      'Planned paid social, digital display advertising in line with commercial plan working with external agencies such as Google, Meta, Kakao and Naver.',
      'Analyze social content including click through, conversion, traffic and report back results',
      'Working closely with the digital experience team and launching the a/b test as a main key member of the project',
    ],
  },
  {
    role: 'Website Publisher',
    company: 'COS',
    description: [
      'Working closely with product designers to update website content in line with commercial plan using ES6+, HTML5+, CSS3+ and CMS',
      ' Launched and Contributed A/B test to improve UX/UI Web maintenance to ensure stability and accessibility on a global scale',
      'Error tracking in Content Management System, identifying any issues',
      'Build and execution of newsletter using CMS and Javascript sending out to communication send-outs to COS worldwide database',
    ],
  },
];
