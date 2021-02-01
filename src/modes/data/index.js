import DataPanel from './DataPanel';
import { processDataAst} from './ast.js';

export default {
  install(Designer){
    processDataAst(Designer);
    Designer.registerPanel('DataPanel', DataPanel);
  },
};
