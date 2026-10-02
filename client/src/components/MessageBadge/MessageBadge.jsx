import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './MessageBadge.module.sass';

function MessageBadge ({ events, setEvents, buttonSwitch, setButtonSwitch }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const completedCount = events.filter(
    ({ eventTime }) => new Date(eventTime).getTime() <= now
  ).length;
  const remindersCount = events.filter(
    ({ eventTime, remiderTime }) =>
      new Date(remiderTime).getTime() <= now &&
      now < new Date(eventTime).getTime()
  ).length;

  if (completedCount === 0 && remindersCount === 0) {
    return null;
  }

  return (
    <section className={styles.badgeWrapper}>
      <div className={styles.badgeHeader}>
        <Link to='/events' style={{ fontSize: '14px', color: 'white' }}>
          <span>Go to Events</span>
        </Link>
        <button
          onClick={() => setButtonSwitch((buttonSwitch = true))}
          className={styles.badgeBtn}
        >
          X
        </button>
      </div>
      <ul className={styles.badgeBlock}>
        {completedCount > 0 && <li>Completed: {completedCount}</li>}
        {remindersCount > 0 && <li>Reminders: {remindersCount}</li>}
      </ul>
    </section>
  );
}

export default MessageBadge;
