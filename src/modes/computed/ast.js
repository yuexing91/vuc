import _ from 'lodash';
import esprimaHelper from '@/helpers/esprimaHelper.js';
import { defineComputed } from '@/helpers/vueHelper';

const exprPath = 'exportdefault.object.property[name=computed]'.split('.');

class ComputedProcessor {
  constructor (vucAst) {
    this.vucAst = vucAst;
    this.process();
  }

  process (computedProperty, code) {
    let vucAst = this.vucAst;
    // let computedProperty = esprimaHelper.getAstByPath(vucAst.loaderResult.ScriptProgram, exprPath);

    if (!computedProperty) {
      return;
    }

    let ComputedExpressions = computedProperty.value.properties;

    vucAst.VucComputeds = _.map(ComputedExpressions, itemProperty => {
      let Annotations = esprimaHelper.extractAnnotations(itemProperty.leadingComments);
      return {
        id: itemProperty.key.name,
        name: Annotations.remark(),
        code: esprimaHelper.getFunctionBodyCode(itemProperty.value, code).trim(),
      };
    });
  }

  toCode () {

    let code = this.vucAst.VucComputeds.map(computed => {
      let comments = '';
      if (computed.name) {
        comments = `\n  //${computed.name}\n`;
      }
      return `${comments}${computed.id}(){
        ${computed.code}
      }`;
    }).join(',');

    return `computed:{${code}}`;
  }

}

export function processDataAst (Designer) {
  Designer.registerVucAstProcess(function (VucAst) {

    Object.assign(VucAst.prototype, {
      saveComputed (data) {
        let vm = this.vucInstance;
        let vucComputed = this.VucComputeds.find(d => data.id == d.id);
        if (vucComputed) {
          Object.assign(vucComputed, data);
          teardownComputedWatch(vm, data.id);
        } else {
          this.VucComputeds.push(data);
        }
        createComputed(vm, data);
      },

      delComputed (data) {
        teardownComputedWatch(this.vucInstance, data.id);
        delete this.vucInstance[data.id];
        let index = this.VucComputeds.indexOf(data);
        this.VucComputeds.splice(index, 1);
        this.vucInstance.$forceUpdate();

      },

    });
    return {
      key: 'computed',
      Processor: ComputedProcessor,
    };
  });
}

function noop () {

}

function createComputed (vm, data) {
  let geter = new Function(data.code);

  vm.$watch(geter, noop, { lazy: true });

  let watch = _.last(vm._watchers);
  vm._computedWatchers[data.id] = watch;
  defineComputed(vm, data.id, geter);
}

function teardownComputedWatch (vm, id) {
  vm._computedWatchers[id].teardown();
}
