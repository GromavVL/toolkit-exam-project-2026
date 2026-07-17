import React from 'react';
import styles from './Questions.module.sass';
import CONSTANTS from './../../../constants';

function Questions () {
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
              <details key={r.question} className={styles.questionItem}>
                <summary className={styles.questionSummary}>
                  {r.question} <span className={styles.icons}>+</span>
                </summary>
                <p className={styles.questionAnswer}>{r.answer}</p>
              </details>
            ))}
          </div>
        </article>
      ))}
    </>
  );
}

export default Questions;
