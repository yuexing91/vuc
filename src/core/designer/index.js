import Designer from './Designer.vue';

function mixin(id, component) {
  const DesignerPanle          = Designer.component('DesignerPanle');
  DesignerPanle.components[id] = component;
}

function registerView(id, component) {
  mixin(id, component);
};

function registerEditor(id, component) {
  mixin(id, component);
};

Object.assign(Designer, {
  registerExtension(name, func){
    Designer[name] = func;
  },
});

Designer.registerExtension('registerView', registerView);
Designer.registerExtension('registerEditor', registerEditor);

export default Designer;
