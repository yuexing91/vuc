import DirectivePanel from './DirectivePanel';

export default {
  install(Designer){
    Designer.registerPanel('DirectivePanel', DirectivePanel);
  },
};
