import React from 'react';
import styles from './EventsPage.module.sass';
import EventsForm from '../../components/EventsForm/EventsForm';
import EventsList from '../../components/EventsList/EventsList';

function EventsPage () {
  return (
    <main className={styles.eventsWrapper}>
      <section className={styles.eventContainer}>
        <div className={styles.formContent}>
          <EventsForm />
        </div>
        <div className={styles.listContent}>
          <EventsList />
        </div>
      </section>
    </main>
  );
}

export default EventsPage;
