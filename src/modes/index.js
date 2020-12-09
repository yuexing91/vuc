import propertys from './propertys';
import explorer from './explorer';

import data from './data';
import computed from './computed';
import methods from './methods';
import watch from './watch';

import text from './text';
import props from './props';
import directive from './directive';
import events from './events';
import styles from './styles';

const Modes = [
  propertys,
  explorer,

  data,
  computed,
  watch,
  methods,

  text,
  props,
  directive,
  events,
  styles,
];

export function initModes (Designer) {
  Modes.forEach(Mode => {
    Designer.use(Mode);
  });
}

