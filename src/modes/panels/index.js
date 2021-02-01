import PanelView from './PanelView.vue';
import { registerPanel } from './util';

export default {
  install(Designer) {
    Designer.registerPanel = registerPanel;
    Designer.registerView('PanelView', PanelView);
  },
};
