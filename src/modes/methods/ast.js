import _ from 'lodash';
import esprimaHelper from '@/helpers/esprimaHelper.js';

const exprPath = 'exportdefault.object.property[name=methods]'.split('.');

class DataProcessor {
  constructor (vucAst) {
    this.vucAst = vucAst;
    this.process();
  }

  process (methodProperty, code) {
    let vucAst = this.vucAst;
    // let methodProperty = esprimaHelper.getAstByPath(vucAst.loaderResult.ScriptProgram, exprPath);

    if (!methodProperty) return;

    let VucMethods = vucAst.VucMethods = [];

    methodProperty.value.properties.map(property => {
      let funJSON = esprimaHelper.parseFunctionExpression(property, code);
      let method = _.pick(funJSON, 'id', 'name', 'bodyCode', 'params');
      method.name = funJSON.Annotations.remark();
      VucMethods.push(method);
    });
  }

  toCode () {
    let code = this.vucAst.VucMethods.map(method => {
      let params = _.map(method.params, 'id').join(',');

      let comments = [];

      if (method.name) {
        comments.push(`* ${method.name}`);
      }

      comments = comments.concat(_.map(method.params, param => {
        let id = param.req ? `[${param.id}]` : param.id;
        return `* @param ${id} ${param.desc || ''}`;
      }));

      let commentCode = '';
      if (comments.length) {
        commentCode = `/**
        ${comments.join('\n')}
        */
        `;
      }

      return `${commentCode} ${method.id}(${params}){ ${method.bodyCode} }`;
    });

    return `methods:{${code}}`;
  }

}

let vucAstMethods = {
  saveMethod (method) {
    let oldMethod = this.VucMethods.find(m => method.id == m.id);
    if (oldMethod) {
      this.updateMethod(oldMethod, method);
    } else {
      this.addMethod(method);
    }
  },

  addMethod (method) {
    this.VucMethods.push(method);
    this.vucInstance[method.id] = this.vucInstance.$options.methods[method.id] = methodToFunction(method, this.vucInstance);
  },

  updateMethod (oldMethod, newMethod) {
    Object.assign(oldMethod, newMethod);
    this.vucInstance[newMethod.id] = this.vucInstance.$options.methods[newMethod.id] = methodToFunction(newMethod, this.vucInstance);
    this.vucInstance.$forceUpdate();
  },

  delMethod (method) {
    let index = this.VucMethods.indexOf(method);
    this.VucMethods.splice(index, 1);
    delete this.vucInstance[method.id];
    this.vucInstance.$forceUpdate();
  },
};

export function processMethodAst (Designer) {
  Designer.registerVucAstProcess(function (VucAst) {
    Object.assign(VucAst.prototype, vucAstMethods);
    return {
      key: 'methods',
      Processor: DataProcessor,
    };
  });
}

function methodToFunction (method, context) {
  return new Function(_.map(method.params, 'id').join(','), method.bodyCode).bind(context);
}
