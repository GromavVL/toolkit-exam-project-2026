import React from 'react';
import styles from './HowItWorks.module.sass';
import CONSTANTS from '../../constants';
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

function HowItWorks () {
  return (
    <main className={styles.pageContent}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>World's #1 Naming Platform</span>
          <h1 className={styles.heading}>How Does Atom Work?</h1>
          <p className={styles.description}>
            Atom helps you come up with a great name for your business by
            combining the power of crowdsourcing with sophisticated technology
            and Agency-level validation services.
          </p>
        </div>
        <div className={styles.videoWrapper}>
          <iframe
            className={styles.videoFrame}
            src='https://iframe.mediadelivery.net/embed/239474/327efcdd-b1a2-4891-b274-974787ae8362?autoplay=false&loop=false&muted=false&preload=true&responsive=true'
            frameBorder='0'
          ></iframe>
        </div>
      </section>
      <section className={styles.cardWrapper}>
        <div className={styles.cardHeadingContent}>
          <span className={styles.badge}>Our Services</span>
          <h2 className={styles.cardHeading}>3 Ways To Use Atom</h2>
          <p className={styles.cardDescription}>
            Atom offers 3 ways to get you a perfect name for your business.
          </p>
        </div>
        <div className={styles.cardContainer}>
          {CONSTANTS.Cards.map(c => (
            <article key={c.title} className={styles.blockCard}>
              <img
                src={`${CONSTANTS.STATIC_IMAGES_PATH}howItWork/${c.img}`}
                alt={c.title}
                className={styles.cardImages}
              />
              <p className={styles.cardTitle}>{c.title}</p>
              <p className={styles.cardBody}>{c.body}</p>
              <a href={c.link} className={styles.cardLink}>
                {c.linkContent}
                <LiaLongArrowAltRightSolid className={styles.icons}/>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HowItWorks;
