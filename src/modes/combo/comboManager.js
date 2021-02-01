import Configurator from '@/config';
import { createCombo } from './ComboTemplate';

let combos = [];

export function findCombo(vucNode) {
  return combos.find(combo => combo.rootNode === vucNode);
}

export function initManager() {
  Configurator.setVucProxyOptions({
    onBeforeRender(rootNode, context) {
      function loop(node) {
        let combo = createCombo(node);
        if (combo) {
          combos.push(combo);
        }
        if (node.children) {
          node.children.forEach(loop);
        }
      }

      combos = [];
      loop(rootNode);

      combos.forEach(combo => {
        combo.eachNodes((node, isRoot) => {
          if (!isRoot) {
            let config = combo.getNodeConfig(node);
            if (config.dragover) {
              return;
            }
            context.cancelOutline(node);
          }
        });
      });
    },
  });

  Configurator.setEditorHooks({
    onBeforeSelectNode(vucNode) {
      let flag = true;
      for(let combo of combos) {
        if (combo.includeNode(vucNode)) {
          if (vucNode === combo.rootNode) {
            return true;
          }
          flag = false;
        }
      }
      return flag;
    },
    onDragover(dropData, targetNode, pos) {
      for(let combo of combos) {
        if (combo.includeNode(targetNode)) {
          //拖到根节点的外层
          if (targetNode === combo.rootNode && pos != 'inner') {
            return true;
          }

          if (pos === 'inner') {
            let config = combo.getNodeConfig(targetNode);
            if (config && config.dragover) {
              return;
            }
          }

          if (combo.onDragover(dropData, targetNode, pos)) {
            return;
          }

          return false;
        }
      }
    },
  });

}
