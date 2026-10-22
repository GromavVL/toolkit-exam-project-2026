import { useState } from 'react';
import styles from './ButtonGroup.module.sass';
import CONSTANTS from './../../constants';
import SwitchButton from './SwitchButton';

const ButtonGroup = () => {
  const defaultIndex = CONSTANTS.BUTTON_ITEMS.find(b => b.recommended);
  const [activeTabIndex, setActiveTabIndex] = useState(defaultIndex.id);

  const handlerClick = id => {
    setActiveTabIndex(id);
  };

  return (
    <div className={styles.buttonGroupWrapper}>
      {CONSTANTS.BUTTON_ITEMS.map(btn => (
        <SwitchButton
          key={btn.id}
          btn={btn}
          handlerClick={handlerClick}
          activeTabIndex={activeTabIndex}
        />
      ))}
    </div>
  );
};

export default ButtonGroup;
