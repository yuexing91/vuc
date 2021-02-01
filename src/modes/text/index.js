import TextPanel from './TextPanel.vue';

export default {
  install(Designer){
    Designer.registerPanel('TextPanel', TextPanel);
  },
};
