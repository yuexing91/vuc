import _ from 'lodash';

import esprimaHelper from '@/helpers/esprimaHelper';
import VucNode from './syntax/VucNode';

function subCode (range, code) {
  return esprimaHelper.subCode(range, code);
}

export default class VucAst {
  constructor (VueOption, file, loaderResult) {
    window.vucAst = this;
    this.file = file;
    // this.loaderResult = loaderResult;

    this.VueOption = VueOption;
    this.vucInstance = null;

    this.ASTNodes = {};

    this.rootNode = new VucNode(VueOption.ast);

    this.pro(loaderResult);
  }

  pro (loaderResult) {
    let code = loaderResult.ScriptContent;

    let exportDefault = _.find(loaderResult.ScriptProgram.body, expr => expr.type === 'ExportDefaultDeclaration');
    let range = exportDefault.range;

    let astProcessorMap = {};
    AstProcessors.forEach(AstProcessor => {
      astProcessorMap[AstProcessor.key] = new AstProcessor.Processor(this);
    });

    this.exportProcessor = _.map(exportDefault.declaration.properties, property => {
      let key = property.key.name;

      let astProcessor = astProcessorMap[key];
      if (astProcessor) {
        astProcessor.process(property, code);
      }

      return {
        key,
        code: subCode(property.value.range, code),
        processor: astProcessor,
      };
    });

    _.forEach(astProcessorMap, (astProcessor, key) => {
      let t = _.find(this.exportProcessor, { key });
      if (!t) {
        this.exportProcessor.push({
          key,
          processor: astProcessor,
        });
      }
    });

    this.otherCode = [subCode([0, range[0]], code), code.substring(range[1])];

  }

  getContent () {
    let exportDefaultCode = 'export default {' +
      this.exportProcessor.map(property => {
        if (property.processor) return property.processor.toCode();
        return `${property.key}:${property.code}`;
      }).join(',') + '}';

    let code = `
    <template>
      ${this.rootNode.toTemplate()}
    </template>
    <script>
      ${this.otherCode[0]}
      ${exportDefaultCode}
      ${this.otherCode[1]}
    </script>`;

    return code;
  }

  getVucNodeByAstId (astId) {
    return this.ASTNodes[astId];
  }

}

const AstProcessors = [];

export function registerAstProcess (processor) {
  AstProcessors.push(processor.call(null, VucAst));
}
