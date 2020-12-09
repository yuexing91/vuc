import Vue from 'vue';

const directiveMap = {
  'v-model': {
    getData(vucNode) {
      if (vucNode.model) {
        return {
          name: 'v-model',
          expression: eval(vucNode.model.expression),
        };
      }
    },
    setData(vucNode, directiveData) {
      if (!vucNode.model) {
        Vue.set(vucNode, 'model', {
          expression: `"${ directiveData.expression }"`,
        });
      } else {
        vucNode.model.expression = `"${ directiveData.expression }"`;
      }

      Vue.set(vucNode.attrsMap, 'v-model', directiveData.expression);
    },
    delData(vucNode) {
      vucNode.model = undefined;
      vucNode.attrsMap['v-model'] = undefined;
    },
  },
  'v-for': {
    getData(vucNode) {
      if (vucNode.attrsMap['v-for']) {
        return {
          name: 'v-for',
          ..._.pick(vucNode, ['for', 'alias', 'iterator1', 'key']),
        };
      }
    },
    setData(vucNode, directiveData) {
      Object.assign(vucNode, directiveData);
      Vue.set(vucNode.attrsMap, 'v-for', `(${ directiveData.alias },${ directiveData.iterator1 }) in ${ directiveData.for }`);
    },
    delData(vucNode) {
      vucNode.attrsMap['v-for'] = undefined;
      Object.assign(vucNode, { for: undefined, alias: undefined, iterator1: undefined, key: undefined });
    },
  },
};


export function getDirectives(vucNode) {
  return Object.values(directiveMap).map(schema => {
    return schema.getData(vucNode);
  }).filter(s => s);
}

export function setDirective(vucNode, name, data) {
  let directive = directiveMap[name];
  directive.setData(vucNode, data);
}

export function getDirective(vucNode, name) {
  let directive = directiveMap[name];
  return directive.getData(vucNode);
}

export function delDirective(vucNode, name) {
  let directive = directiveMap[name];
  return directive.delData(vucNode);
}
