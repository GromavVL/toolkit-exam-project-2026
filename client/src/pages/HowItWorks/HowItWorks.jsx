import React from 'react';
import styles from './HowItWorks.module.sass';
import CONSTANTS from '../../constants';
import { LiaLongArrowAltRightSolid } from 'react-icons/lia';
import { IoSearchOutline } from 'react-icons/io5';

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
                <LiaLongArrowAltRightSolid className={styles.icons} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.cardStepWrapper}>
        <div className={styles.cardStepHeader}>
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}howItWork/achievements.svg`}
            alt='achievements'
            className={styles.cardStepIcon}
          />
          <h2 className={styles.cardStepTitle}>How Do Naming Contests Work?</h2>
        </div>
        <div className={styles.cardStepList}>
          {CONSTANTS.StepCards.map((step, s) => (
            <article key={step.titleStep} className={styles.cardStepItem}>
              <span className={styles.cardStepItemTitle}>{step.titleStep}</span>
              <p className={styles.cardStepItemBody}>{step.bodyStep}</p>
              {s < CONSTANTS.StepCards.length - 1 && (
                <LiaLongArrowAltRightSolid className={styles.cardStepArrow} />
              )}
            </article>
          ))}
        </div>
      </section>
      <section className={styles.searchBlock}>
        <div className={styles.searchInputWrapper}>
          <IoSearchOutline className={styles.searchBlockIcon} />
          <input
            type='text'
            placeholder='Search Over 300,000+ Premium Names'
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <IoSearchOutline className={styles.searchButtonIcon} />
          </button>
        </div>
        <div className={styles.searchTagsList}>
          {CONSTANTS.searchTags.map(tag => (
            <a key={tag.label} href={tag.href} className={styles.searchTagItem}>
              {tag.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HowItWorks;
