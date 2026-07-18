import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './ButtonGroup.module.sass';
import CONSTANTS from './../../constants';

function ButtonGroup () {
  const defaultIndex = CONSTANTS.BUTTON_ITEMS.findIndex(b => b.recommended);
  const [selectedIndex, setSelectedIndex] = useState(
    defaultIndex >= 0 ? defaultIndex : 0
  );
  return (
    <div className={styles.buttonGroupWrapper}>
      {CONSTANTS.BUTTON_ITEMS.map((b, i) => {
        const baseButtonGroup = classNames(styles.buttonGroupItems, {
          [styles.selected]: i === selectedIndex,
        });

        return (
          <button
            type='button'
            onClick={() => setSelectedIndex(i)}
            key={i}
            className={baseButtonGroup}
          >
            {b.recommended ? (
              <span className={styles.buttonGroupRecommended}>Recommended</span>
            ) : null}
            <span className={styles.buttonGroupTitle}>{b.title}</span>
            <span className={styles.buttonGroupBody}>{b.body}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ButtonGroup;
