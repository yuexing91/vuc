import WatchView from './WatchView';
import { processDataAst } from './ast.js';

export default {
  install (Designer) {
    processDataAst(Designer);
    Designer.registerConfigurator('WatchView', WatchView);
  },
};
