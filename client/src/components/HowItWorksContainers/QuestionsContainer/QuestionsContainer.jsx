import styles from './QuestionsContainer.module.sass';
import CONSTANTS from './../../../constants';
import QuestionItem from '../QuestionItem/QuestionItem';

function QuestionsContainer () {
  const slugify = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <>
      <nav className={styles.nav}>
        {CONSTANTS.QUESTIONS.map(n => (
          <a
            key={n.title}
            href={`#${slugify(n.title)}`}
            className={styles.navItem}
          >
            {n.title}
          </a>
        ))}
      </nav>
      {CONSTANTS.QUESTIONS.map(q => (
        <article
          key={q.title}
          id={slugify(q.title)}
          className={styles.questionContainer}
        >
          <h3 className={styles.titleQuestion}>{q.title}</h3>
          <div className={styles.questionList}>
            {q.body.map(r => (
              <QuestionItem item={r} key={r.question} />
            ))}
          </div>
        </article>
      ))}
    </>
  );
}

export default QuestionsContainer;
