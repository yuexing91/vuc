import VucAst, { registerAstProcess } from './VucAst';
import Builder from '@/runtime/builder';
import File from './File';

export function initRuntime (Designer) {
  Designer.registerExtension('registerVucAstProcess', registerAstProcess);
}

export function createVucAst (content) {
  let file = new File('main.vue').setContent(content)

  let builder = new Builder();
  let result = builder.build(file);
  let vueOption = result.entry().default;

  return new VucAst(vueOption, file, result.result);
}
