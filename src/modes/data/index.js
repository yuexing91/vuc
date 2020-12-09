import DataView from './DataView';
import { processDataAst} from './ast.js';

export default {
  install(Designer){
    processDataAst(Designer);
    Designer.registerConfigurator('DataView', DataView);
  },
};
