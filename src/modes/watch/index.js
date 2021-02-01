import WatchPanel from './WatchPanel';
import { processDataAst } from './ast.js';

export default {
  install (Designer) {
    processDataAst(Designer);
    Designer.registerPanel('WatchPanel', WatchPanel);
  },
};
