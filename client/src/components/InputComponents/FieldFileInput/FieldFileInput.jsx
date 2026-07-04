import React from 'react';
import { Field } from 'formik';

const FieldFileInput = ({ classes, ...rest }) => {
  const { fileUploadContainer, labelClass, fileNameClass, fileInput } = classes;

  return (
    <Field name={rest.name}>
      {props => {
        const { field, form, meta } = props;
        const getFileName = () => {
          if (props.field.value) {
            return props.field.value.name;
          }
          return '';
        };
        const handleChange = e => {
          const file = e.currentTarget.files[0];
          form.setFieldValue(field.name, file);
        }
        return (
          <div className={fileUploadContainer}>
            <label htmlFor='fileInput' className={labelClass}>
              Choose file
            </label>
            <span id='fileNameContainer' className={fileNameClass}>
              {getFileName()}
            </span>
            <input
              onChange={handleChange}
              className={fileInput}
              id='fileInput'
              type='file'
            />
          </div>
        );
      }}
    </Field>
  );
};

export default FieldFileInput;
