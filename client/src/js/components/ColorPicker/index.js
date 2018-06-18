import { h } from 'hyperapp';
import './ColorPicker.css';
import { ColorPickerIcon } from '../../icons';

const Colors = [
  '#F44336',
  '#FF9800',
  '#9C27B0',
  '#673AB7',
  '#1e2e92',
  '#3F51B5',
  '#03A9F4',
  '#18FFFF',
  '#1ed760',
  '#009688'
];

const ColorPicker = ({ isOpen, onToggle, onSelectColor, onCreate }) => (
  <div class={isOpen ? 'color-picker color-picker--open' : 'color-picker'}
       oncreate={onCreate}>
    <ColorPickerIcon className="color-picker__toggler" onclick={onToggle}/>
    {Colors.map(color =>
      <div class="color-picker__item"
           style={{ backgroundColor: color }}
           onclick={() => onSelectColor(color)}></div>
    )}
  </div>
);

export default ColorPicker;
