import { h } from 'hyperapp';
import './ColorPicker.css';
import { ColorPickerIcon, EditIcon, ShuffleIcon } from '../../icons';
import { getRandomColor } from '../../utils';

const BackgroundColors = [
  '#F44336',
  '#FF9800',
  '#9C27B0',
  '#c69cf4',
  '#673AB7',
  '#1e2e92',
  '#3F51B5',
  '#03A9F4',
  '#18FFFF',
  '#1ed760',
  '#009688'
];

const TextColors = [
  '#F2F2F5',
  '#2F3034'
];

const ColorPicker = ({ isOpen, onToggle, onSelectBackgroundColor, onSelectTextColor, onCreate }) => (
  <div class={isOpen ? 'color-picker color-picker--open' : 'color-picker'}
       oncreate={onCreate}>
    <div className="color-picker__toggler" onclick={onToggle}>
      <ColorPickerIcon/>
    </div>
    {BackgroundColors.map(color =>
      <div class="color-picker__item"
           style={{ backgroundColor: color }}
           onclick={() => onSelectBackgroundColor(color)}></div>
    )}
    <div class="color-picker__item color-picker__item--custom"
         onclick={() => {
           const color = prompt('Pick a custom color');

           if (color) {
             onSelectBackgroundColor(color);
           }
         }}>
      <EditIcon/>
    </div>
    <div class="color-picker__item color-picker__item--custom"
         onclick={() => onSelectBackgroundColor(getRandomColor())}>
      <ShuffleIcon/>
    </div>
    {TextColors.map(color =>
      <div class="color-picker__item color-picker__item--custom"
           style={{ color }}
           onclick={() => onSelectTextColor(color)}>Aa</div>
    )}
  </div>
);

export default ColorPicker;
