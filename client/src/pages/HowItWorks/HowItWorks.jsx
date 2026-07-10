import React from 'react';
import styles from './HowItWorks.module.sass';

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
            frameborder='0'
          ></iframe>
        </div>
      </section>
    </main>
  );
}

export default HowItWorks;
