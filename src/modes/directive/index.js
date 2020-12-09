import DirectiveView from './DirectiveView';

export default {
  install(Designer){
    Designer.registerConfigurator('DirectiveView', DirectiveView);
  },
};
