# vuc

> vue文件的可视化设计器；支持组件拖拽、导出为vue文件。
> [在线预览](https://yuexing91.github.io/vuc-demo/)
> [demo](https://github.com/yuexing91/vuc-demo)


* 所见即所得
* 支持自定义扩展
* 支持任意模板片段
* 支持扩展模块（后续文档再定）
* 支持vue文件中的data、computed、watch、methods可视化维护
* 支持template节点中的props、style（暂时只支持静态样式）、directive、event

## 优点
> 相对于传统设计器生成的json配置，vuc直接生成的是vue文件更加适合二次开发。

## 适用场景

* 低代码平台
* 表单设计器
* 报表设计器


## 安装

``` bash
npm install vuc-designer --save

```
# 使用

### main.js
```js

  import Vuc from 'vuc-designer';
  import 'vuc-designer/dist/styles/vuc.css';
  //设计器UI使用的是iview
  import 'view-design/dist/styles/iview.css';

  //引入组件配置
  import InputConfig from './InputConfig';
  import ButtonConfig from './ButtonConfig';

  //注册配置
  Vuc.Designer.setVucConfig(ButtonConfig);
  Vuc.Designer.setVucConfig(InputConfig);

  //设计器选项
  let options = {
    // 左侧可拖拽组件配置
    components: [
      {
        title: '基础',
        children: [
          {
            id: 'text',
            title: '文本',
            template: '文本',
            isText: true,
          },
          {
            id: 'i-button',
            title: '按钮',
            template: '<i-button>按钮</i-button>',
          },
        ],
      },
    ],
  };

  // vue文件内容
  let vueContent = `
    <template>
      <div>
        <i-input v-model="age" style="width: 120px;"></i-input>
        <i-button @click="add">btn</i-button>
        <span>
          {{ age1 }}
        </span>
      </div>
    </template>
    <script>
       export default {
          data() {
            return {
              //年龄
              age: 10,
            };
          },
          computed: {
            age1() {
              return '年龄:' + this.age ;
            },
          },
          methods: {
            //增加
            add() {
              this.age++;
            },
          },
        };
    </script>`;

  let designer = new Vuc.Designer({
      propsData: {
        content: vueContent,
        options,
      },
    });

  designer.$mount(document.querySelector('#app'));

  //获取修改后的内容
  console.log(designer.getVueContent());

```

### ButtonConfig.js
```js
export default {
 id: ['i-button', 'Button'],
 name: '按钮',
 eventTypes: [{
   id: 'click',
   name:'点击',
 }],
 slots: [{
   slot: 'default',
   name: '按钮内容',
 }],
 type: ['button'],
 props: {
   type: {
     label: '按钮类型',
     editors: {
       type: 'select',
       props: {
         items: [{
           value:'default',
           label:'默认'
         },{
           value:'primary',
           label:'主色调'
         }],
       },
     },
   },
   ghost: {
     label: '幽灵按钮',
     editors: 'boolean',
     help: '幽灵属性，使按钮背景透明',
   },
   long: {
     label: '长按钮',
     editors: 'boolean',
   },
   disabled: {
     label: '禁用',
     editors: 'boolean',
   },
   loading: {
     label: '加载中',
     editors: 'boolean',
   },
   icon: {
     label: '图标',
     editors: 'icon',
   },
 },
}



```

### InputConfig.js
```js
export default {
  id: 'i-input',
  name: '输入框',
  eventTypes: [],
  type: ['input'],
  props: {
    value: {
      label: '值',
      editors: 'text',
    },
    placeholder: {
      label: '占位文本	',
      editors: 'text',
    },
    clearable: {
      label: '清空按钮',
      editors: 'boolean',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    readonly: {
      label: '只读',
      editors: 'boolean',
    },
    maxlength: {
      label: '最大输入长度',
      editors: 'number',
    },
    icon: {
      label: '图标',
      editors: 'icon',
    },
    prefix: {
      label: '头部图标',
      editors: 'icon',
    },
    suffix: {
      label: '尾部图标',
      editors: 'icon',
      advanced: true,
    },
    search: {
      label: '搜索型输入框',
      editors: 'boolean',
    },
    enterButton: {
      label: '搜索按钮',
      editors: [{
        name: '是否启用',
        type: 'boolean',
      }, {
        name: '按钮文本',
        type: 'text',
      }],
      advanced: true,
    },
    rows: {
      label: '默认行数',
      editors: 'number?min=1&max=10',
      advanced: true,
    },
    autosize: {
      label: '自适应高度',
      editors: 'boolean',
      advanced: true,
    },
    number: {
      label: '转换成数字',
      editors: 'boolean',
      advanced: true,
    },
    autofocus: {
      label: '自动获取焦点',
      editors: 'boolean',
      advanced: true,
    },
    autocomplete: {
      label: '自动完成',
      editors: {
        type: 'boolean?trueValue=on&falseValue=off',
        dynamic: false,
      },
      advanced: true,
    },
  },
};
```
