import _ from 'lodash';
import { proxy } from '@/helpers/vueHelper';
import esprimaHelper from '@/helpers/esprimaHelper.js';

const exprPath = 'exportdefault.object.property[name=data]'.split('.');

class DataProcessor {
  constructor(vucAst) {
    this.vucAst = vucAst;
    this.process();
  }

  process(dataProperty, code) {
    let vucAst = this.vucAst;
    vucAst.VucDatas = [];

    // let dataProperty = esprimaHelper.getAstByPath(vucAst.loaderResult.ScriptProgram, exprPath);
    if (!dataProperty) return;

    let FunctionExpression = dataProperty.value;

    //附加代码
    let attachCode = esprimaHelper.getFunctionBodyNoReturnCode(FunctionExpression, code);
    vucAst.VucDatasAttachCode = attachCode;

    let returnExpression = esprimaHelper.getFunctionReturnExpression(FunctionExpression, code);
    vucAst.VucDatas = esprimaHelper.parseObjectExpression(returnExpression, code);
  }

  toCode() {
    let attachCode = this.vucAst.VucDatasAttachCode || '';
    let code = this.vucAst.VucDatas.map(data => {
      let comments = '';
      if (data.name) {
        comments = `\n  //${ data.name }\n`;
      }
      return `${ comments }${ data.id }:${ data.code }`;
    }).join(',');

    return `data(){ ${ attachCode || '' }
      return {${ code }}
    }`;
  }

}

function codeToData(code) {
  return esprimaHelper.parseExpression(code);
}


function $setRootData(vm, key, value) {
  vm.$set(vm.ROOT_PROXY_DATA, key, value);
  proxy(vm, 'ROOT_PROXY_DATA', key);
}

const vucAstMethods = {
  saveData(data) {
    let vucData = this.VucDatas.find(d => data.id == d.id);
    if (vucData) {
      this.updateData(vucData, data);
    } else {
      this.addData(data);
    }
  },

  addData(data) {
    this.VucDatas.push(data);
    let t = codeToData(data.code);
    if (t.type === 'ObjectExpression') {
      data.children = esprimaHelper.parseObjectExpression(t, `(${ data.code })`);
    }
    $setRootData(this.vucInstance, data.id, new Function('return ' + data.code).call(this.vucInstance));
  },

  findChildData(path) {
    let t = {
      children: this.VucDatas,
    };
    path.split('.').forEach(id => {
      if (t != null) {
        t = _.find(t.children, { id });
      }
    });
    return t;
  },

  addChildData(path, data) {
    let datas = this.VucDatas;
    let paths = path.split('.');
    paths.forEach(p => {
      datas = _.find(datas, { id: p }).children;
    });

    let oldData = _.find(datas, { id: data.id });
    if (oldData) {
      return;
    }

    datas.push(data);

    let root = _.find(this.VucDatas, { id: paths[0] });

    function getCode(data) {
      return '{' + data.children.map(child => {
        return child.id + ':' + ( child.children ? getCode(child) : child.code );
      }).join(',') + '}';
    }

    root.code = getCode(root);
  },

  updateData(oldData, newData) {
    let children;
    if (oldData.code !== newData.code) {
      this.vucInstance[newData.id] = new Function('return ' + newData.code).call(this.vucInstance);
    }
    let t = codeToData(newData.code);
    if (t.type === 'ObjectExpression') {
      children = esprimaHelper.parseObjectExpression(t, `(${ newData.code })`);
    }

    Object.assign(oldData, newData, { children });
  },

  delData(data) {
    let index = this.VucDatas.indexOf(data);
    let vm = this.vucInstance;
    this.VucDatas.splice(index, 1);
    if (_.has(vm.ROOT_PROXY_DATA, data.id)) {
      vm.$delete(vm.ROOT_PROXY_DATA, data.id);
    }
    vm[data.id] = undefined;
  },
};

export function processDataAst(Designer) {
  Designer.registerVucAstProcess(function (VucAst) {
    Object.assign(VucAst.prototype, vucAstMethods);
    return {
      key: 'data',
      Processor: DataProcessor,
    };
  });
}
