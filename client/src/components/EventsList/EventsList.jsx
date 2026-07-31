import React from 'react';
import styles from './EventsList.module.sass';
import EventTimer from '../EventTimer/EventTimer';
import { BsClockHistory } from 'react-icons/bs';

function EventsList ({ events, setEvents }) {
  const handleDelete = indexToDelete => {
    setEvents(prevEvents => prevEvents.filter((el, i) => i !== indexToDelete));
  };
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
        {events.length === 0 ? (
          <li className={styles.massageNoEvents}>No events available</li>
        ) : (
          events.map((e, i) => (
            <EventTimer event={e} key={i} onDelete={() => handleDelete(i)} />
          ))
        )}
      </ul>
    </>
  );
}

export default EventsList;
