import React, { useState, useEffect } from 'react';
import styles from './EventsPage.module.sass';
import EventsForm from '../../components/EventsForm/EventsForm';
import EventsList from '../../components/EventsList/EventsList';
import CONSTANTS from '../../constants';

function EventsPage () {
  const [events, setEvents] = useState(() => {
    const stored = window.localStorage.getItem(CONSTANTS.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    window.localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  return (
    <main className={styles.eventsWrapper}>
      <section className={styles.eventContainer}>
        <div className={styles.formContent}>
          <EventsForm setEvents={setEvents} />
        </div>
        <div className={styles.listContent}>
          <EventsList events={events} setEvents={setEvents} />
        </div>
      </section>
    </main>
  );
}

export default EventsPage;
