import EventView from './EventView.vue';

export default {
  install(Designer){
    Designer.registerConfigurator('EventView', EventView);
  },
};
