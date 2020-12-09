# vuc

> vue文件的可视化编辑器

## Install

``` bash
npm install vuc-designer --save

```
# Usage

### main.js
```js

  import Vuc from 'vuc-designer';
  import ButtonConfig from './ButtonConfig';

  Vuc.Designer.setVucConfig(ButtonConfig);

  let options = {
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

  let vueContent = `
    <template>
      <div>
        <i-input v-model="value"></i-input>
        <i-button @click="add"></i-button>
        <span>
          年龄 {{ age1 }}
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
              return this.age1;
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
   size: {
     label: '尺寸',
     editors: getSizeEditor(),
   },
   shape: {
     label: '按钮形状',
     editors: {
       type: 'select',
       props: {
         items: createItems(`circle,:default`, ','),
       },
     },
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
