import _ from 'lodash';
import esprimaHelper from '@/helpers/esprimaHelper.js';

const exprPath = 'exportdefault.object.property[name=watch]'.split('.');

class WatchProcessor {
  constructor (vucAst) {
    this.vucAst = vucAst;
    vucAst.VucWatchs = [];
    this.process();
  }

  process (watchProperty, code) {
    let vucAst = this.vucAst;
    // let watchProperty = esprimaHelper.getAstByPath(vucAst.loaderResult.ScriptProgram, exprPath);

    if (!watchProperty) {
      return;
    }

    let watchExpressions = watchProperty.value.properties;

    vucAst.VucWatchs = _.map(watchExpressions, itemProperty => {
      let functionPrototype = itemProperty;
      let deep = false, immediate = false;

      if (functionPrototype.value.type === 'ObjectExpression') {
        _.map(functionPrototype.value.properties, p => {
          if (p.key.name === 'handler') {
            functionPrototype = p.value;
          } else if (p.key.name === 'deep' && p.value.type === 'Literal') {
            deep = p.value.value;
          } else if (p.key.name === 'immediate' && p.value.type === 'Literal') {
            immediate = p.value.value;
          }
        });
      }

      let funJSON = esprimaHelper.parseFunctionExpression(functionPrototype, code);
      let method = _.pick(funJSON, 'name', 'bodyCode', 'params');
      let Annotations = esprimaHelper.extractAnnotations(itemProperty.leadingComments);

      method.id = itemProperty.key.name;
      method.name = Annotations.remark();
      method.deep = deep;
      method.immediate = immediate;
      return method;
    });

  }

  toCode () {
    let code = this.vucAst.VucWatchs.map(watch => {
      let comments = '';
      if (watch.name) {
        comments = `\n  //${watch.name}\n`;
      }

      let handler = `(${_.map(watch.params, 'id').join(',')}){${watch.bodyCode}}`;

      if (watch.immediate || watch.deep) {
        return `${comments}${watch.id}:{
          ${watch.immediate ? 'immediate:true,' : ''}
          ${watch.deep ? 'deep:true,' : ''}
          handler${handler}
        }`;
      }

      return `${comments}${watch.id}${handler}`;
    }).join(',');
    return `watch:{${code}}`;
  }
}

export function processDataAst (Designer) {
  Designer.registerVucAstProcess(function (VucAst) {

    Object.assign(VucAst.prototype, {
      saveWatch (data) {
        let vucWatch = this.VucWatchs.find(d => data.id == d.id);
        if (vucWatch) {
          this._teardownWatch(vucWatch.id);
          Object.assign(vucWatch, data);
        } else {
          this.VucWatchs.push(data);
        }
        this._watch(data);
      },

      delWatch (data) {
        this._teardownWatch(data.id);
        let index = this.VucWatchs.indexOf(data);
        this.VucWatchs.splice(index, 1);
      },

      _watch (data) {
        let cb = new Function(data.code);
        this.vucInstance.$watch(data.id, cb);
      },

      _teardownWatch (id) {
        let watch = _.find(this.vucInstance._watchers, { expression: id });
        watch.teardown();
      },

    });

    return {
      key: 'watch',
      Processor: WatchProcessor,
    };
  });
}
