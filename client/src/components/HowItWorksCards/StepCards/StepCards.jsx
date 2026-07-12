import styles from './StepCards.module.sass';
import CONSTANTS from './../../../constants';
import { LiaLongArrowAltRightSolid } from 'react-icons/lia';

function StepCards () {
  return (
    <>
      {CONSTANTS.StepCards.map((step, s) => (
        <article key={step.titleStep} className={styles.cardStepItem}>
          <span className={styles.cardStepItemTitle}>{step.titleStep}</span>
          <p className={styles.cardStepItemBody}>{step.bodyStep}</p>
          {s < CONSTANTS.StepCards.length - 1 && (
            <LiaLongArrowAltRightSolid className={styles.cardStepArrow} />
          )}
        </article>
      ))}
    </>
  );
}

export default StepCards;
