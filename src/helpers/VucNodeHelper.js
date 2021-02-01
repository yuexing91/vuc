import { compile } from '@/runtime/vue-template-compiler/build.js';
import VucNode from '@/runtime/syntax/VucNode';

export default {
  createVucNode(template) {
    const node = compile(template).ast;
    return new VucNode(node);
  },
  createTextNode(text, type = 2) {
    return new VucNode({
      text,
      type,
    }, null);
  },
};
