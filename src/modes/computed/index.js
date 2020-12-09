import ComputedView from './ComputedView';
import { processDataAst } from './ast.js';

export default {
  install (Designer) {
    processDataAst(Designer);
    Designer.registerConfigurator('ComputedView', ComputedView);
  },
};
