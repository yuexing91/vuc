import _ from 'lodash';
import Vue from 'vue';

import { compileToFunctions } from '@/runtime/vue-template-compiler/build.js';
import { getVucProxyHooks } from './config';

function createTemplate(node, context) {
  let extraAttrsMap = callHook('extraAttrs', node, context) || {};

  let defaultAttrsMap = {
    'data-ast-id': node._astId,
    ':vucNode': `ASTNodes.${ node._astId }`,
  };

  if (node.type == '3' || node.type == '2') {
    let parentVucProxyOption = node.parent.getConfig('vucProxyOption');
    if (parentVucProxyOption && parentVucProxyOption.textProxy === false) {
      return node.text;
    }

    defaultAttrsMap.class = 'vuc-proxy-text';

    let attrs = getAttrStr(Object.assign({}, extraAttrsMap, defaultAttrsMap));
    return `<span ${ attrs }>${ node.text }</span>`;
  }

  let vucProxyOption = node.getConfig('vucProxyOption');
  if (vucProxyOption) {
    if (vucProxyOption.extraAttrs) {
      Object.assign(extraAttrsMap, vucProxyOption.extraAttrs(node, context));
    }
  }

  if (node.tag !== 'template' && !node.hasAttr('key')) {
    defaultAttrsMap.key = node._astId;
  }

  let attrs = getAttrStr(Object.assign({}, node.attrsMap, extraAttrsMap, defaultAttrsMap));

  let children = node.children.map(n => createTemplate(n, context)).join(' ');

  return `<${ node.tag } ${ attrs }>${ children }</${ node.tag }>`;
}

export function generateVucProxy(opts, vucAst) {
  let VueOption = vucAst.VueOption;

  vucAst.ASTNodes = {};

  function render(h) {
    let context = {};

    proxyErrorHandler(this);
    beforeRender(vucAst, context);

    let template = createTemplate(vucAst.rootNode, context);
    let compiled = compileToFunctions(template, {
//      //代理事件响应
//      eventHandle(code) {
//        return `($event)=> ( ${ code }).call(this,$event)`;
//      },
    });

    return compiled.render.call(this, h);
  }

  let proxyOptions = Object.assign({}, VueOption, opts, {
    name: 'PageProxy',
    render,
  });

  proxyOptions.mixins = proxyOptions.mixins || [];
  proxyOptions.mixins.push({
    data() {
      return {
        ASTNodes: vucAst.ASTNodes,
        ROOT_PROXY_DATA: {},
      };
    },
  });

  return new Vue(proxyOptions);
}

function beforeRender(vucAst, context) {
  let nodeMap = vucAst.ASTNodes;
  callHook('onBeforeRender', vucAst.rootNode, context);
  vucAst.rootNode.eachAllNode(function (node) {
    if (!nodeMap[node._astId]) {
      Vue.set(nodeMap, node._astId, node);
    }

    let vucProxyOption = node.getConfig('vucProxyOption');
    if (vucProxyOption && vucProxyOption.onBeforeRender) {
      vucProxyOption.onBeforeRender(node, context);
    }
  });
}

function proxyErrorHandler(vm) {
  if (!vm.__proxy__) {
    vm.__proxy__ = true;
    let _c = vm._c;
    vm._c = function (a, b, c, d) {
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
}

function callHook(hook, ...args) {
  let vucProxyHooks = getVucProxyHooks();
  if (vucProxyHooks && vucProxyHooks[hook]) {
    let result = {};
    let hooks = _.castArray(vucProxyHooks[hook]);
    hooks.forEach(h => {
      Object.assign(result, h.call(this, ...args));
    });
    return result;
  }
}

function getAttrStr(attrs) {
  return _.map(attrs, (v, k) => {
    return v === undefined ? '' : `${ k }="${ v }"`;
  }).join(' ');
}
