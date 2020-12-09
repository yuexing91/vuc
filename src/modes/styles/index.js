import StyleView from './StyleView.vue';

export default {
  install(Designer){
    Designer.registerConfigurator('StyleView', StyleView);
  },
};
