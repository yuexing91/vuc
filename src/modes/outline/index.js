import Configurator from '@/config';

export default {
  install(Designer) {
    let noOutlineNodeMap = {};
    Configurator.setVucProxyOptions({
      onBeforeRender(root, context) {
        context.cancelOutline = function (node) {
          noOutlineNodeMap[node._astId] = true;
        };
      },

      extraAttrs(node) {
        if (noOutlineNodeMap[node._astId]) {
          return {
            'no-outline': '',
          };
        }
      },
    });
  },
};
