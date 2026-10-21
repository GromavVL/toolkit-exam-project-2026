import { useState } from 'react';
import { IoIosAdd, IoIosClose } from 'react-icons/io';
import styles from './QuestionItem.module.sass';

const QuestionItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details className={styles.questionItem}>
      <summary
        className={styles.questionSummary}
        onClick={() => setIsOpen(prev => !prev)}
      >
        {item.question}
        {isOpen ? (
          <IoIosClose className={styles.iconsClose} />
        ) : (
          <IoIosAdd className={styles.icons} />
        )}
      </summary>
      <p className={styles.questionAnswer}>{item.answer}</p>
    </details>
  );
};

export default QuestionItem;
