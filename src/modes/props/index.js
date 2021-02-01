import PropsPanel from './PropsPanel.vue';

export default {
  install(Designer) {
    Designer.registerPanel('PropsPanel', PropsPanel);
  },
};
