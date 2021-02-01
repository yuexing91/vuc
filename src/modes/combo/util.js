import { parseHTML } from '@/runtime/vue-template-compiler/build.js';

export function parseTemplate(template) {
  let stack = [];
  let parent, root = null;

  parseHTML(template, {
    start(tag, attrs, unary) {
      let element = {};

      attrs.forEach(attr => {
        let value = attr.value;
        if (attr.value === 'false') {
          value = false;
        } else if (attr.value === 'true' || attr.value === '') {
          value = true;
        }
        element[attr.name] = value;
      });

      Object.assign(element, {
        tag,
        selector: tag.startsWith('type.') ? tag.substr(5) : tag,
        num: _.isUndefined(element.num) ? 1 : element.num,
        allowChildren: element.allowChildren === false ? false : true,
      });

      if (!root) {
        root = element;
      }

      parent = stack[stack.length - 1];
      if (!unary) {
        stack.push(element);
      }

      if (parent) {
        parent.children = ( parent.children || [] );
        parent.children.push(element);
      }

    },
    end() {
      stack.length -= 1;
    },
  });

  return root;
}
