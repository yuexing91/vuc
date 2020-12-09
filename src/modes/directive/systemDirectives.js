export const directiveSchemas = [
  {
    name: 'v-model',
    describe: '在表单控件上创建双向绑定',
    props: [{
      name: 'expression',
      describe: '源数据',
    }],
  },
  {
    name: 'v-for',
    describe: '基于源数据多次渲染',
    props: [{
      name: 'for',
      describe: '源数据',
    }, {
      name: 'alias',
      describe: '数据别名',
    }, {
      name: 'iterator1',
      describe: '索引别名',
    }, {
      name: 'key',
      describe: 'key',
    }],
  },
];

export function getDirectiveSchema(name) {
  return directiveSchemas.find(schema => schema.name == name);
}
