import StylePanel from './StylePanel.vue';

export default {
  install(Designer){
    Designer.registerPanel('StylePanel', StylePanel);
  },
};
