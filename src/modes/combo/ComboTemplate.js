import _ from 'lodash';
import { parseTemplate } from './util';
import { camelize } from '@/helpers/lang';
import Combo from './Combo';

class ComboTemplate {
  constructor(options) {
    Object.assign(this, options);
    this.node = parseTemplate(options.template);
  }

  createCombo(vNode) {
    let nodeMap;
    let nodeConfig;
    let match = getMatch([this.node], [vNode]);
    if (match) {
      nodeMap = { [this.node.key]: vNode };
      nodeConfig = { [vNode._astId]: this.node };
      if (childrenSame(this.node, vNode)) {

        if (this.valid && !this.valid(vNode)) {
          return;
        }

        return new Combo(this, vNode, nodeMap, nodeConfig);
      }
    }

    function childrenSame(cNode, vNode) {
      if (_.isEmpty(cNode.children)) {
        return _.isEmpty(vNode.children) || cNode.allowChildren;
      }
      let match = getMatch(cNode.children, vNode.children);
      if (match) {

        for(let i = 0; i < cNode.children.length; i++) {
          if (!match[i + 1]) continue;
          let id = getID(match[i + 1]);
          let cn = cNode.children[i];
          let vn = _.find(vNode.children, { _astId: id });
          nodeConfig[vn._astId] = cn;

          if (cn.key) {
            nodeMap[cn.key] = vn;
          }
          if (!childrenSame(cn, vn)) {
            return false;
          }
        }

        return true;
      }
      return false;
    }

    function getMatch(cNodes, vNodes) {
      let RE = createREs(cNodes || []);
      let str = createStrs(vNodes || []);
      return str.match(RE);
    }

  }

}

function getID(str) {
  let m = str.match(/id="(.*?)"/);
  return m ? m[1] : undefined;
}

function createREs(cNodes) {
  return new RegExp('^' + cNodes.map(createRE).join('') + '$');
}

function createRE(cNode) {
  let reStr = '';
  if (cNode.tag.startsWith('type.')) {
    reStr = `(<.[^<>]*class="${ cNode.selector }".*[^<>]*>)`;
  } else if (cNode.tag == 'any') {
    reStr = `(<.[^<>]*>)`;
  } else {
    reStr = `(<${ camelize(cNode.selector) }.*[^<>]*>)`;
  }

  let num = parseInt(cNode.num);
  if (isNaN(num)) {
    reStr += cNode.num;
  } else if (cNode.num !== 1) {
    reStr += `{${ num }}`;
  }

  return reStr;
}

function createStrs(vNodes) {
  return vNodes.map(createStr).join('');
}

function createStr(vNode) {
  if (vNode.isText()) {
    return '<text>';
  }
  let config = vNode.getConfig();
  let tag = camelize(vNode.tag);
  if (!config) return `<${ tag } id="${ vNode._astId }">`;
  let types = '';
  if (config.type) {
    types = config.type.map(t => ` class="${ t }"`).join('');
  }

  return `<${ tag } id="${ vNode._astId }"${ types }>`;
}

const COMBOTEMPLATE_MAPS = Object.create(null);

export function registerComboTemplate(options) {
  COMBOTEMPLATE_MAPS[options.id] = new ComboTemplate(options);
};

export function createCombo(vNode) {
  for(let id in COMBOTEMPLATE_MAPS) {
    let comboTemplate = COMBOTEMPLATE_MAPS[id];
    let combo = comboTemplate.createCombo(vNode);
    if (combo) {
      return combo;
    }
  }
}
