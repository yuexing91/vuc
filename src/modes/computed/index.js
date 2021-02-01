import ComputedPanel from './ComputedPanel';
import { processDataAst } from './ast.js';

export default {
  install (Designer) {
    processDataAst(Designer);
    Designer.registerPanel('ComputedPanel', ComputedPanel);
  },
};
