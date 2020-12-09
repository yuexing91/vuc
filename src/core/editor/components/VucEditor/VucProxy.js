import Vue from 'vue';
import { compileToFunctions } from '@/runtime/vue-template-compiler/build.js';

export function generateVucProxy (opts, vucAst) {
  let VueOption = vucAst.VueOption;

  let ASTNodes = vucAst.ASTNodes = {};

  function createTemplate (node) {
    if (!ASTNodes[node._astId]) {
      Vue.set(ASTNodes, node._astId, node);
    }

    if (node.type == '3' || node.type == '2') {
      return `<span data-ast-id="${node._astId}" :vucNode="ASTNodes.${node._astId}" class="vuc-proxy-text">${node.text}</span>`;
    }

    let attrs = node.getAttrsString();

    if (node.tag !== 'template' && !node.attrsMap[':key']) {
      attrs += ` key="${node._astId}"`;
    }

    let children = node.children.map(createTemplate).join(' ');

    return `<${node.tag} data-ast-id="${node._astId}" :vucNode="ASTNodes.${node._astId}" ${attrs}>${children}</${node.tag}>`;
  }

  function render (h) {

    let template = createTemplate(vucAst.rootNode);
    // let compiled = compileToFunctions(`<keep-alive>${template}</keep-alive>`);
    let compiled = compileToFunctions(template);

    if (!this.__proxy__) {
      this.__proxy__ = true;
      let _c = this._c;
      this._c = function (a, b, c, d) {
        if (b instanceof Error) {
          console.error(b);
          return h.call(this, 'pre', {
            style: {
              color: 'red',
              outline: '1px dashed #aaa',
            },
            attrs: { 'data-ast-id': b.key },
          }, a + ' 组件渲染出错了!\n' + b.message);
        }
        return _c.call(this, a, b, c, d);
      };
    }

    return compiled.render.call(this, h);
  }

  let proxyOptions = Object.assign({}, VueOption, opts, {
    name: 'PageProxy',
    render,
  });

  proxyOptions.mixins = proxyOptions.mixins || [];
  proxyOptions.mixins.push({
    data () {
      return {
        ASTNodes,
        ROOT_PROXY_DATA: {},
      };
    },
  });

  return new Vue(proxyOptions);
}

