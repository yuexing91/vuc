import outline from './outline';
import attrEditor from './attrEditor';
import panels from './panels';
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
import combo from './combo';
import optionEditor from './optionEditor';

const Modes = [
  outline,
  attrEditor,

  panels,
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
  combo,
  optionEditor,
];

export function initModes(Designer) {
  Modes.forEach(Mode => {
    Designer.use(Mode);
  });
}

