import styles from './OptionCards.module.sass';
import CONSTANTS from './../../../constants';
import { LiaLongArrowAltRightSolid } from 'react-icons/lia';

function OptionCards () {
  return (
    <>
      {CONSTANTS.CARDS.map(c => (
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
    </>
  );
}

export default OptionCards;
