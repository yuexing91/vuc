import { registerComboTemplate } from './ComboTemplate';
import ComboPanel from './ComboPanel';
import { initManager } from './comboManager';

export default {
  install(Designer) {
    initManager();
    Designer.registerPanel('ComboPanel', ComboPanel);
    Designer.registerComboTemplate = registerComboTemplate;
  },
};
