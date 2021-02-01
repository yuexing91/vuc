import _ from 'lodash';
import Vue from 'vue';

import { camelize } from '@/helpers/lang';
import { getVucConfig } from '../../config/vucConfig';
import { getDirectives, getDirective, setDirective, delDirective } from './directives';

export default class VucNode {
  constructor(node, parent) {

    for(let key in node) {
      if (key === 'children') {
        let children = _.filter(node.children, function (n) {
          return !( n.text === ' ' && n.type === 3 );
        });

        this.children = children.map(child => {
          if (child instanceof VucNode) {
            child.parent = this;
            return child;
          }
          return new VucNode(child, this);
        });
      } else {
        this[key] = node[key];
      }
    }

    if (!this.isText()) {
      this.children = this.children || [];
      this.directives = this.directives || [];

      this.camelizeTag = camelize(this.tag);
    }
    this.attrsMap = this.attrsMap || {};
    this._astId = _.uniqueId('ast_');

    Object.defineProperty(this, 'parent', {
      writable: true,
      enumerable: false,
      configurable: true,
      value: parent,
    });
  }

  getIndex() {
    return this.parent ? this.parent.getChildIndex(this) : -1;
  }

  getChildIndex(child) {
    return this.children ? this.children.indexOf(child) : -1;
  }

  getChild(index) {
    return this.children[index];
  }

  getBeforeNode() {
    const index = this.getIndex();
    if (this.parent) {
      return this.parent.getChild(index - 1);
    }
  }

  getAfterNode() {
    const index = this.getIndex();
    if (this.parent) {
      return this.parent.getChild(index + 1);
    }
  }

  getParentNode() {
    if (this.parent) {
      if (this.parent.tag !== 'template') {
        return this.parent;
      }
      if (this.parent.parent && this.parent.parent.tag !== 'template') {
        return this.parent.parent;
      }
    }
  }

  getBelongSlotName() {
    if (this.attrsMap.slot) {
      return this.attrsMap.slot;
    }

    if (this.parent.tag === 'template' && this.parent.attrsMap.slot) {
      return this.parent.attrsMap.slot;
    }

    return 'default';
  }

  getAttrsString() {
    return _.map(this.attrsMap, (v, k) => {
      return v === undefined ? '' : `${ k }="${ v }"`;
    }).join(' ');
  }

  getScopeVariables() {
    let scopes = [];
    let node = this;
    while (node) {
      if (node.alias) {
        scopes.push(_.pick(node, ['alias', 'for', 'iterator1']));
      }
      node = node.parent;
    }
    return scopes;
  }

  setTag(tag) {
    this.tag = tag;
    this.camelizeTag = camelize(tag);
  }

  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  removeChild(child) {
    const dropIndex = this.getChildIndex(child);
    this.children.splice(dropIndex, 1);
  }

  empty() {
    this.children = [];
  }

  insterNode(node, index) {
    if (node.parent === this) {
      if (node.getIndex() + 1 < index) {
        index--;
      }
    }
    node.remove();
    node.parent = this;
    this.children.splice(index, 0, node);
  }

  insterNodes(nodes, index) {
    nodes = _.castArray(nodes);
    nodes.forEach(node => {
      if (node.parent === this) {
        if (node.getIndex() + 1 < index) {
          index -= nodes.length;
        }
      }
      node.remove();
      node.parent = this;
    });
    this.children.splice(index, 0, ...nodes);
  }

  appendNode(nodes) {
    _.castArray(nodes).forEach(node => {
      node.remove();
      node.parent = this;
      this.children.push(node);
    });
  }

  insterBefore(beforeNode) {
    const index = this.getIndex();
    this.parent.insterNodes(beforeNode, index);
  }

  insterAfter(afterNode) {
    const index = this.getIndex();
    this.parent.insterNodes(afterNode, index + 1);
  }

  insterToSlot(insterNode, slot) {
    const node = this;
    const slotNode = _.find(node.children, child => {
      return child.attrsMap && child.attrsMap.slot == slot;
    });

    if (slotNode) {
      if (slotNode.tag === 'template') {
        slotNode.appendNode(insterNode);
      } else {
        const index = slotNode.getIndex();
        slotNode.remove();
        slotNode.setAttrsMap('slot', undefined);
        insterNode.remove();
        insterNode.setAttrsMap('slot', undefined);

        const template = VucNode.createNode('template', { slot }, [slotNode, insterNode]);
        this.insterNode(template, index);
      }
    } else {
      insterNode.setAttrsMap('slot', slot === 'default' ? undefined : slot);
      if (insterNode.parent !== node) {
        this.appendNode(insterNode);
      }
    }
  }

  setAttrsMap(key, value) {
    if (_.has(this.attrsMap, key)) {
      this.attrsMap[key] = value;
    } else {
      this.attrsMap = Object.assign({ [key]: value }, this.attrsMap);
    }
  }

  setStyle(style, dynamic = false) {
    let setKey = dynamic ? ':style' : 'style';
    Vue.set(this.attrsMap, setKey, style);
  }

  setAttr(key, value, dynamic) {
    if (_.isUndefined(dynamic)) {
      dynamic = !_.isString(value);
    }
    let setKey = dynamic ? ':' + key : key;
    let delKey = dynamic ? key : ':' + key;

    let oldValue = this.attrsMap[setKey];
    let hasOldValue = _.has(this.attrsMap, setKey);

    if (!hasOldValue && _.isUndefined(value)) {
      return false;
    }

    Vue.delete(this.attrsMap, delKey);

    if (value !== undefined && value !== '' && value !== null) {
      Vue.set(this.attrsMap, setKey, value);
    } else {
      Vue.delete(this.attrsMap, setKey);
    }

    if (hasOldValue && oldValue === value) {
      return false;
    }

    return true;
  }

  setText(text, type = 2) {
    if (this.isText()) {
      this.text = text;
    } else {
      this.children = [createTextNode(text, this, type)];
    }
  }

  replaceText(text, type = 2) {
    if (this.isText()) {
      this.text = text;
    } else {
      let textNode = createTextNode(text, this, type);
      let index = this.children.findIndex(child => child.isText());
      if (index == -1) {
        this.appendNode(textNode);
      } else {
        this.children.splice(index, 1, textNode);
      }
    }
  }

  getText() {
    if (this.isText()) return this.text;
    return this.children.map(child => child.getText()).join('').trim();
  }

  getAttrDynamic(key) {
    if (_.has(this.attrsMap, ':' + key)) {
      return 'dynamic';
    }
    if (_.has(this.attrsMap, key)) {
      return 'static';
    }
  }

  hasAttr(key, dynamic) {
    let d = this.getAttrDynamic(key);
    return dynamic ? d === dynamic : d ? true : false;
  }

  getAttr(key) {
    let d = this.getAttrDynamic(key);
    if (d === 'dynamic') {
      return this.getDynamicAttr(key);
    }
    if (d === 'static') {
      return this.getStaticAttr(key);
    }
  }

  getStaticAttr(key) {
    return this.attrsMap[key];
  }

  getDynamicAttr(key) {
    return this.attrsMap[':' + key];
  }

  moveToBefore() {
    const beforeNode = this.getBeforeNode();
    if (beforeNode) {
      beforeNode.insterBefore(this);
    }
  }

  moveToAfter() {
    const afterNode = this.getAfterNode();
    if (afterNode) {
      this.insterAfter(this);
    }
  }

  moveToSlot(slot) {
    const parent = this.getParentNode();
    parent.insterToSlot(this, slot);
  }

  clone() {
    return new VucNode(cloneNode(this));
  }

  /***
   * 参数node是否是当前vucNode的子孙元素
   * @param node
   * @returns {boolean}
   */
  isOffspring(node) {
    if (this === node) return true;
    let t = node;

    while (true) {
      if (!t.parent) break;
      if (t.parent === this) return true;
      t = t.parent;
    }
    return false;
  }

  closest(selector) {
    let temp = this;
    while (temp.parent) {
      if (temp.parent.test(selector)) {
        return temp.parent;
      }
      temp = temp.parent;
    }
  }

  getParents() {
    let node = this;
    let parents = [];
    while (node.parent) {
      parents.push(node.parent);
      node = node.parent;
    }
    return parents;
  }

  querySelector(selector) {
    //.card>.row>.col>.form-item
    let paths = parseSelector(selector);
    let node = this;
    for(let path of paths) {
      node = node[path.method].call(node, path.sel);
      if (!node) return;
    }
    return node;
  }

//  querySelectorAll(selector) {
//    //.card>.row>.col>.form-item
//    let paths = parseSelector(selector, true);
//    let nodes = [this];
//    for(let path of paths) {
//
//      nodes.forEach(node => {
//
//      });
//
//      node = node[path.method].call(node, path.sel);
//      if (!node) return;
//    }
//    return node;
//  }

  eachAllNode(iterator) {
    function loop(node) {
      iterator(node);
      _.forEach(node.children, loop);
    }

    loop(this);
  }

  //深度优先
  dfs(iterator) {
    let children = [].concat(this.children);

    while (children.length) {
      let child = children.shift();
      let state = iterator(child);

      //中断搜索
      if (state === -1) {
        return child;
      }

      //不继续搜索子节点
      if (state === 0) {
        continue;
      }

      if (child.children) {
        children = [].concat(child.children).concat(children);
      }
    }
  }

  //广度优先
  bfs(iterator) {
    let children = [].concat(this.children);

    while (children.length) {
      let child = children.shift();
      let state = iterator(child);

      //中断搜索
      if (state === -1) {
        return child;
      }

      //不继续搜索子节点
      if (state === 0) {
        continue;
      }

      if (child.children) {
        children = children.concat(child.children);
      }
    }
  }

  findChildDeep(selector) {
    return this.bfs(child => child.test(selector) ? -1 : undefined);
  }

  findChildrenDeep(selector) {
    let array = [];

    this.bfs(child => {
      if (child.test(selector)) {
        array.push(child);
      }
    });

    return array;
  }

  findChild(selector) {
    return this.children.find(child => child.test(selector));
  }

  findChildren(selector) {
    return this.children.filter(child => child.test(selector));
  }

  getAttrsStr() {
    return _.map(this.attrsMap, (v, k) => {
      if (_.isUndefined(v)) return '';
      return `${ k }="${ v }"`;
    }).join(' ');
  }

  toString() {
    return this._astId;
  }

  toTemplate() {
    if (this.type == '3' || this.type == '2') {
      return this.text;
    }
    let attrs = this.getAttrsStr();
    let children = this.children.map(child => child.toTemplate()).join('');
    return `<${ this.tag } ${ attrs }>${ children }</${ this.tag }>`;
  }

  getConfig(key, defaultValue) {
    let config = getVucConfig(this.camelizeTag);
    if (key) {
      return _.has(config, key) ? config[key] : defaultValue;
    }
    return config;
  }

  isHTML() {
    return isHTMLTag[this.tag];
  }

  isText() {
    return this.type === 2 || this.type === 3;
  }

  getDirectives() {
    return getDirectives(this);
  }

  getDirective(name) {
    return getDirective(this, name);
  }

  setDirective(data) {
    return setDirective(this, data);
  }

  delDirective(name) {
    return delDirective(this, name);
  }

  test(selector) {
    if (selector[0] === '.') {
      selector = selector.substr(1);
      let config = this.getConfig();
      if (config) {
        return config.type.includes(selector);
      }
    }
    return this.tag === selector || this.camelizeTag === camelize(selector);
  }

  static createNode() {
    return createNode.apply(this, arguments);
  }

}

function createNode(tag, attrsMap = {}, children = []) {
  const node = {
    tag,
    attrsMap,
    children,
  };
  return new VucNode(node);
}

function createTextNode(text, parent, type = 2) {
  return new VucNode({ text, type }, parent);
}

function cloneNode(node) {
  const _node = {};
  _.map(node, (val, key) => {
    if (_.isFunction(val) || key.startsWith('_')) return;

    let _val;
    if (key === 'children') {
      _val = _.map(val, cloneNode);
    } else if (key === 'parent') {
      _val = undefined;
    } else {
      _val = _.cloneDeep(val);
    }

    _node[key] = _val;
  });
  return _node;
}

function makeMap(str) {
  const map = {};
  str.split(',').forEach(k => map[k] = true);
  return map;
}

function parseSelector(selector, all) {
  let method = 'findChildDeep';
  let paths = [];
  let sel = '';
  let map = {
    ' ': 'findChildDeep',
    '>': 'findChild',
  };

  if (all) {
    method = 'findChildrenDeep';
    map = {
      ' ': 'findChildrenDeep',
      '>': 'findChildren',
    };
  }

  for(let s of selector.split('')) {
    if (map[s]) {
      push();
      method = map[s];
      sel = '';
    } else {
      sel += s;
    }
  }

  push();

  function push() {
    if (sel) {
      paths.push({
        method,
        sel,
      });
    }
  }

  return paths;
}


const isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot',
);
