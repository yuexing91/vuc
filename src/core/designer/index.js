import Designer from './Designer.vue';

import { registerView, getAllView, getView } from './views';

Object.assign(Designer, {
  registerExtension(name, func) {
    Designer[name] = func;
  },
});

Designer.registerExtension('registerView', registerView);
Designer.registerExtension('getAllView', getAllView);
Designer.registerExtension('getView', getView);

export default Designer;
