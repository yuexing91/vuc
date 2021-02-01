import OptionEditorPanel from './OptionEditorPanel.vue';

export default {
  install(Designer) {
    Designer.registerPanel('OptionEditorPanel', OptionEditorPanel);
  },
};
