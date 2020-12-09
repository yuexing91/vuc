import MethodView from './MethodView.vue';
import { processMethodAst } from './ast.js';

export default {
  install (Designer) {
    processMethodAst(Designer);
    Designer.registerConfigurator('MethodView', MethodView);
  },
};
