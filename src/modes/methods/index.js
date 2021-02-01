import MethodPanel from './MethodPanel.vue';
import { processMethodAst } from './ast.js';

export default {
  install (Designer) {
    processMethodAst(Designer);
    Designer.registerPanel('MethodPanel', MethodPanel);
  },
};
