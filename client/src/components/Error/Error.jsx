import styles from './Error.module.sass';

const Error = props => {
  const getMessage = () => {
    const { status, data } = props;
    switch (status) {
      case status:
        return data;
      default:
        return 'Server Error';
    }
  };

  const { clearError } = props;
  return (
    <div className={styles.errorContainer}>
      <span>{getMessage()}</span>
      <i className='far fa-times-circle' onClick={() => clearError()} />
    </div>
  );
};

export default Error;
