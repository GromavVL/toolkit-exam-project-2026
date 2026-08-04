import React from 'react';
import styles from './EventTimer.module.sass';
import useCountdown from './../../hocs/timerLeft';
import { IoTrashOutline } from 'react-icons/io5';

function EventTimer ({ event, onDelete }) {
  const { expired, days, hours, minutes, seconds, percentPassed } =
    useCountdown(event.eventTime, event.createdAt);

  return (
    <li
      className={styles.timeEl}
      title={event.eventName}
      style={{ '--percent': `${percentPassed}%` }}
    >
      <span className={styles.eventName}>{event.eventName}</span>
      <div className={styles.timeElActions}>
        {expired ? (
          <p className={styles.expired}>Expired</p>
        ) : (
          <p className={styles.time}>
            {days ? (
              <span>
                {days}d {hours}h {minutes}m {seconds}s
              </span>
            ) : hours ? (
              <span>
                {hours}h {minutes}m {seconds}s
              </span>
            ) : minutes ? (
              <span>
                {minutes}m {seconds}s
              </span>
            ) : (
              <span>{seconds}s</span>
            )}
          </p>
        )}
        <button className={styles.deleteBtn} onClick={onDelete}>
          <IoTrashOutline />
        </button>
      </div>
    </li>
  );
}

export default EventTimer;
