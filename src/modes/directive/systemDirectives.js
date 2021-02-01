export const directiveSchemas = [
  {
    name: 'model',
    describe: '在表单控件上创建双向绑定',
    props: [{
      name: 'value',
      describe: '源数据',
      required: true,
    }],
  },
  {
    name: 'show',
    describe: '可见性',
    props: [{
      name: 'value',
      describe: '条件',
      required: true,
    }],
  },
  {
    name: 'if',
    describe: '条件渲染',
    props: [{
      name: 'value',
      describe: '条件',
      required: true,
    }],
  },
  {
    name: 'for',
    describe: '基于源数据多次渲染',
    props: [{
      name: 'for',
      describe: '源数据',
      required: true,
    }, {
      name: 'alias',
      describe: '数据',
      required: true,
    }, {
      name: 'iterator1',
      describe: '索引',
    }, {
      name: 'key',
      describe: 'key',
    }],
  },
  {
    name: 'html',
    describe: '插入html',
    props: [{
      name: 'value',
      describe: 'HTML',
      required: true,
    }],
  },
  {
    name: 'else',
    describe: '条件渲染',
    props: [{
      name: 'value',
      describe: '条件',
      required: true,
    }],
  },
  {
    name: 'if-else',
    describe: '条件渲染',
    props: [{
      name: 'value',
      describe: '条件',
      required: true,
    }],
  },
];

export function getDirectiveSchema(name) {
  return directiveSchemas.find(schema => schema.name == name);
}
