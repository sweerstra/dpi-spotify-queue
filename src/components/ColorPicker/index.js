import React, { useState } from 'react';
import classNames from 'classnames';
import style from './index.module.css';
import { colorStorage } from '../../data/storage';
import { EditIcon, ShuffleIcon } from '../../icons';

const Colors = [
  '#FFEB3B',
  '#FF9800',
  '#F44336',
  '#D81B60',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#2F3034',
  '#F2F2F5'
];

function ColorPicker() {
  const [colorType, setColorType] = useState('background');

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
  }

  function selectCustomColor() {
    const color = prompt('Pick a custom color');
    color && selectColor(color);
  }

  function selectColor(color) {
    if (colorType === 'background') {
      colorStorage.setMainColor(color);
      document.documentElement.style.setProperty('--color-main', color);
    } else if (colorType === 'text') {
      colorStorage.setTintColor(color);
      document.documentElement.style.setProperty('--color-tint', color);
    }
  }

  const customColorClass = classNames(
    style['item-custom'],
    'tooltip'
  );

  const colorItems = Colors.map(color =>
    <div className={style.item}
         style={{ backgroundColor: color }}
         onClick={() => selectColor(color)}
         key={color}/>
  );

  const customColor = (
    <div className={customColorClass}
         data-title="Pick Custom Hex Color"
         onClick={selectCustomColor}>
      <EditIcon/>
    </div>
  );

  const randomColor = (
    <div className={customColorClass}
         data-title="Pick Random Color"
         onClick={() => selectColor(getRandomColor())}>
      <ShuffleIcon/>
    </div>
  );

  return (
    <div className={style.ColorPicker}>
      <div className={style.colors}>
        {colorItems}
      </div>
      <hr className={style.divider}/>
      <div className={style.customs}>
        {customColor}
        {randomColor}
        <div className={classNames(customColorClass, { [style.active]: colorType === 'background' })}
             data-title="Select Background"
             onClick={() => setColorType('background')}>
          B
        </div>
        <div className={classNames(customColorClass, { [style.active]: colorType === 'text' })}
             data-title="Select Text"
             onClick={() => setColorType('text')}>
          T
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
