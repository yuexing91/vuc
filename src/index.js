import Vue from 'vue';
import iView from 'view-design';
import 'view-design/dist/styles/iview.css';

import CoreUI from './ui';
import Designer from './core/designer';
import { initModes } from './modes';
import { initRuntime } from './runtime';
import { initConfig } from './config';
import './css/index.less';

Vue.use(iView, {
  transfer: true,
});
Vue.use(CoreUI);

initRuntime(Designer);
initModes(Designer);
initConfig(Designer);

export default {
  Designer,
};
