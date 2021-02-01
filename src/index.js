import Vue from 'vue';

import CoreUI from './ui';
import Core from './core';
import { initModes } from './modes';
import { initRuntime } from './runtime';
import { initConfig } from './config';
import './css/index.less';

let Designer = Core.Designer;

Vue.use(CoreUI);

initRuntime(Designer);
initModes(Designer);
initConfig(Designer);

export default {
  Designer,
};
