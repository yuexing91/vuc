import PropertysView from './PropertysView.vue';

export default {
  install (Designer) {

    Designer.registerConfigurator = function (id, Component) {
      PropertysView.components[id] = Component;
    };

    // Designer.registerVucNodeConfigurator = function (id, Component) {
    //   registerComponent('vucNode', { id, Component });
    //   PropertysView.components[id] = Component;
    // };

    Designer.registerView('PropertysView', PropertysView);
  },
};
