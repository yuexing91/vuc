import ExplorerView from './ExplorerView.vue';

export default {
  install(Designer){
    Designer.registerView('ExplorerView', ExplorerView);
  },
};
