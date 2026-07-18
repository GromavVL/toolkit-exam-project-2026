import React from 'react';
import styles from './EventsPage.module.sass';
import EventsForm from '../../components/EventsForm/EventsForm';
import EventsList from '../../components/EventsList/EventsList';

function EventsPage () {
  return (
    <div>
      EventsPage
      <EventsForm />
      <EventsList />
    </div>
  );
}

export default EventsPage;
