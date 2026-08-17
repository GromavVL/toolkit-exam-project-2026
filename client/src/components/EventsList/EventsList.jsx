import React, { useState, useEffect } from 'react';
import styles from './EventsList.module.sass';
import EventTimer from '../EventTimer/EventTimer';
import { BsClockHistory } from 'react-icons/bs';
import { BsMenuButtonWide } from 'react-icons/bs';

function EventsList ({ events, setEvents }) {
  const [buttonList, setButtonList] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = indexToDelete => {
    setEvents(prevEvents =>
      prevEvents.filter(item => item.id !== indexToDelete)
    );
  };
  const newSortEvents = [...events].sort(
    (a, b) => new Date(a.eventTime) - new Date(b.eventTime)
  );
  const completedCount = events.filter(
    ({ eventTime }) => new Date(eventTime).getTime() <= now
  ).length;
  const remindersCount = events.filter(
    ({ eventTime, remiderTime }) =>
      new Date(remiderTime).getTime() <= now &&
      now < new Date(eventTime).getTime()
  ).length;
  return (
    <>
      <div className={styles.headingEventList}>
        <div className={styles.timeBlock}>
          <h2 className={styles.titleContent}>Live upcomming checks</h2>
          <div className={styles.infoAnchor}>
            <button
              className={styles.iconButton}
              onClick={() => {
                setButtonList(prevButtonList => !prevButtonList);
              }}
            >
              <BsMenuButtonWide />
              {remindersCount > 0 && (
                <span className={styles.elentCount}>{remindersCount}</span>
              )}
            </button>
            {buttonList && (
              <div className={styles.infoBlock}>
                <p>Completed: {completedCount}</p>
                <p>Reminders: {remindersCount}</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.timeBlock}>
          <p className={styles.timeBlockContent}>Remaming time</p>
          <BsClockHistory className={styles.titleIcon} />
        </div>
      </div>
      <ul className={styles.timeRenderList}>
        {newSortEvents.length === 0 ? (
          <li className={styles.massageNoEvents}>No events available</li>
        ) : (
          newSortEvents.map(e => (
            <EventTimer
              event={e}
              key={e.id}
              onDelete={() => handleDelete(e.id)}
            />
          ))
        )}
      </ul>
    </>
  );
}

export default EventsList;
