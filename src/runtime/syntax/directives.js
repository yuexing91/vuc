import Vue from 'vue';
import _ from 'lodash';

const directiveMap = {
  'model': {
    getData(vucNode) {
      return defaults.getData('model', vucNode);
    },
    setData(vucNode, data) {
      defaults.setData(vucNode, data);
      if (!vucNode.model) {
        Vue.set(vucNode, 'model', {
          expression: `"${ data.value }"`,
        });
      } else {
        vucNode.model.expression = `"${ data.value }"`;
      }
    },
    delData(vucNode) {
      vucNode.model = undefined;
      defaults.delData('model', vucNode);
    },
  },
  'for': {
    getData(vucNode) {
      if (vucNode.attrsMap['v-for']) {
        return {
          name: 'for',
          ..._.pick(vucNode, ['for', 'alias', 'iterator1', 'key']),
        };
      }
    },
    setData(vucNode, directiveData) {
      Object.assign(vucNode, directiveData);
      vucNode.setAttr('v-for', `(${ directiveData.alias },${ directiveData.iterator1 }) in ${ directiveData.for }`);
      vucNode.setAttr('key', directiveData.key, true);
    },
    delData(vucNode) {
      vucNode.setAttr('v-for', undefined);
      Object.assign(vucNode, { for: undefined, alias: undefined, iterator1: undefined, key: undefined });
    },
  },
};

let defaults = {
  getData(vucNode, name) {
    let vShow = _.find(vucNode.directives, { name });
    if (vShow) {
      return Object.assign({}, vShow);
    }
  },
  setData(vucNode, data) {
    let name = data.name;
    let directive = _.find(vucNode.directives, { name });
    if (directive) {
      directive.value = data.expression;
    } else {
      vucNode.directives = vucNode.directives || [];
      vucNode.directives.push({
        arg: null,
        isDynamicArg: false,
        modifiers: undefined,
        name: name,
        rawName: `v-${ name }`,
        value: data.value,
      });
    }

    vucNode.setAttr(`v-${ name }`, data.value);
  },
  delData(vucNode, name) {
    vucNode.directives = _.filter(vucNode.directives, d => d.name != name);
    vucNode.setAttr(`v-${ name }`, undefined);
  },
};


export function getDirectives(vucNode) {
  let directives = _.map(vucNode.directives, d => {
    return Object.assign({}, d);
  });

  let d = directiveMap.for.getData(vucNode);
  if (d) {
    directives.push(d);
  }
  return directives;
}

export function setDirective(vucNode, data) {
  let directive = directiveMap[data.name];
  if (directive) {
    directive.setData(vucNode, data);
  } else {
    defaults.setData(vucNode, data);
  }
}

export function getDirective(vucNode, name) {
  let directive = directiveMap[name];
  if (directive) {
    directive.getData(vucNode);
  } else {
    defaults.getData(vucNode, name);
  }
}

export function delDirective(vucNode, name) {
  let directive = directiveMap[name];
  if (directive) {
    directive.delData(vucNode);
  } else {
    defaults.delData(vucNode, name);
  }
}
