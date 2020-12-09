import TextView from './TextView.vue';

export default {
  install(Designer){
    Designer.registerConfigurator('TextView', TextView);
  },
};
