import EventPanel from './EventPanel.vue';

export default {
  install(Designer){
    Designer.registerPanel('EventPanel', EventPanel);
  },
};
