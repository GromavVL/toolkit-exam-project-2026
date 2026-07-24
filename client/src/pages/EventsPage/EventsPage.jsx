import React, { useState } from 'react';
import styles from './EventsPage.module.sass';
import EventsForm from '../../components/EventsForm/EventsForm';
import EventsList from '../../components/EventsList/EventsList';

function EventsPage () {
  if (!window.localStorage.getItem('accessEvent')) {
    window.localStorage.setItem('accessEvent', JSON.stringify([])) || [];
  }
  const [events, setEvents] = useState(
    JSON.parse(window.localStorage.getItem('accessEvent'))
  );
  return (
    <main className={styles.eventsWrapper}>
      <section className={styles.eventContainer}>
        <div className={styles.formContent}>
          <EventsForm events={events} setEvents={setEvents} />
        </div>
        <div className={styles.listContent}>
          <EventsList events={events} />
        </div>
      </section>
    </main>
  );
}

export default EventsPage;
