import classNames from 'classnames';
import styles from './ButtonGroup.module.sass';
import { IoMdCheckmark } from 'react-icons/io';

const SwitchButton = ({ btn, handlerClick, activeTabIndex }) => {
  const {id, title, body, recommended} = btn
  const handler = e => {
    handlerClick(e);
  };

  return (
    <button
      className={classNames(styles.buttonGroupItems, {
        [styles.selected]: id === activeTabIndex,
      })}
      type='button'
      onClick={() => handler(id)}
    >
      {recommended && (
        <span className={styles.buttonGroupRecommended}>Recommended</span>
      )}
      <span className={styles.buttonGroupTitle}>{title}</span>
      <span className={styles.buttonGroupBody}>{body}</span>
      {id === activeTabIndex && (
        <IoMdCheckmark className={styles.checkMark} />
      )}
    </button>
  );
};

export default SwitchButton;
