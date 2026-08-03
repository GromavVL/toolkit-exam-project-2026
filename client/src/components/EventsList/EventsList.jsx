import React from 'react';
import styles from './EventsList.module.sass';
import EventTimer from '../EventTimer/EventTimer';
import { BsClockHistory } from 'react-icons/bs';

function EventsList ({ events, setEvents }) {
  const handleDelete = indexToDelete => {
    setEvents(prevEvents =>
      prevEvents.filter(item => item.id !== indexToDelete)
    );
  };
  const newSortEvents = [...events].sort(
    (a, b) => new Date(a.eventTime) - new Date(b.eventTime)
  );
  return (
    <>
      <div className={styles.headingEventList}>
        <h2 className={styles.titleContent}>Live upcomming checks </h2>
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
