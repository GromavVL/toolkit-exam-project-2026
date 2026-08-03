import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import styles from './EventsForm.module.sass';
import Schems from '../../utils/validators/validationSchems';
import FormInput from '../FormInput/FormInput';

function EventsForm ({ events, setEvents }) {
  const initialValues = {
    eventName: '',
    eventTime: '',
    remiderTime: '',
  };
  const saveEvent = newEvent => {
    window.localStorage.setItem('accessEvent', JSON.stringify(newEvent));
    setEvents(newEvent);
  };
  const handlerSubmit = (values, { resetForm }) => {
    const newEvent = [
      ...events,
      { ...values, createdAt: Date.now(), id: uuidv4() },
    ];
    saveEvent(newEvent);
    resetForm();
  };
  const formInputClasses = {
    container: styles.inputContainer,
    input: styles.input,
    warning: styles.warning,
    notValid: styles.notValid,
    valid: styles.valid,
  };
  return (
    <div>
      <h2 className={styles.title}>Create new event</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handlerSubmit}
        validationSchema={Schems.EventSchema}
      >
        {formikProps => (
          <Form className={styles.form}>
            <label className={styles.labelForm}>
              <span className={styles.titleForm}>Event name</span>
              <FormInput
                type='text'
                name='eventName'
                label='Create logo'
                classes={formInputClasses}
              />
            </label>
            <label className={styles.labelForm}>
              <span className={styles.titleForm}>Event time</span>
              <FormInput
                type='datetime-local'
                name='eventTime'
                classes={formInputClasses}
              />
            </label>
            <label className={styles.labelForm}>
              <span className={styles.titleForm}>Event remiber time</span>
              <FormInput
                type='datetime-local'
                name='remiderTime'
                classes={formInputClasses}
              />
            </label>
            <button type='submit' className={styles.submitButton}>
              Create event
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EventsForm;
