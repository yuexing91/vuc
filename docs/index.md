# vuc

### 全局方法

#### setConfig
- 功能 设置配置项
- 参数
  - key
  - value

#### getConfig
- 功能 获取配置项
- 参数
  - key

#### setVucConfig
- 功能 设置vucNode配置项
- 参数
  - vucConfig
    - `id`: `String` | `Array`
    - `name`: `String`
    - `eventTypes`: `Array` 组件拥有的事件
      - `id` 事件id
      - `name` 显示名称
    - `slots`: `Array` 插槽
      - `slot` vue中的slot
      - `name` 显示名称
      - `selector` css选择器
      - 举例
      ```js
        {
          slot: 'default',
          name: '卡片内容',
          selector: '.ivu-card>.ivu-card-body',
        }
        ```
    - `type` `Array` 自定义分类，可以为后续一些功能使用，例如 'input' 'button'
    - `props` `Object` 属性配置
      - key 对应vue中的propName
      - value `Object`
        - label 显示名称
        - editors `string` | `array` | `object` 编辑器
          - name 显示名称
          - type `select` | `text` | `boolean` | `number` | `icon`
          - dynamic boolean 是否为动态属性
          - props 传递给editor的props
        - advanced boolean 是否为高级选项
        - help 帮助信息
      - 示例
      ```js
        props = {
          type: {
              label: '类型',
              editors: {
                type: 'select',
                props: {
                  items: createItems(`text,password,textarea,url,email,date,number,tel`),
                },
              },
              help: `输入框类型，可选值为 <code>text</code> <code>password</code>
                    <code>textarea</code> <code>url</code> <code>email</code>
                    <code>date</code> <code>number</code> <code>tel</code>`,
            },
          placeholder: {
            label: '占位文本	',
            editors: 'text',
          },
          rows: {
            label: '默认行数',
            editors: 'number?min=1&max=10',
            advanced: true,
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
        }
      ```
    - `onDrop` `function` 拖拽被放置时触发的事件，返回false阻止放置。简单说当前被拖拽的组件允许被放置到什么地方
       - 参数
         - dropData 被拖拽的数据
         - targetNode 目标节点
         - pos 位置 't' | 'r' | 'l' | 'b' | 'inner'
    - `onDragover` `function` 拖拽中触发的事件，是否运行放置返回false阻止拖拽。简单说就是当前节点下允许放置什么组件
           - 参数
             - dropData 被拖拽的数据
             - targetNode 目标节点
             - pos 位置 't' | 'r' | 'l' | 'b' | 'inner'


#### registerExtension
> 注册扩展
- 用法
```javascript
Designer.registerExtension('registerView', function() {

});
```

#### registerView
> 注册视图组件

```javascript
Designer.registerView('ExplorerView', {...});
```

#### getView
> 获取已注册的视图

```vue
<template>
  <ExplorerView></ExplorerView>
</template>
<script>
let ExplorerView = Designer.getView('ExplorerView');
export default{
  components:{ExplorerView}
}
</script>

```

### 内置组件

#### Designer

- **Props:**
  - `content` `String` vue文件内容
  - `editorOptions`: 编辑器选项
    - `showRuler` `Boolean` 是否显示像素刻度尺
    - `wrapperStyle` `Object` 编辑器包裹样式，用来模拟body样式
    - `showStructure` `Boolean` 是否显示右侧元素结构视图
    - `beforeSelectNode` `Function` 通过鼠标事件在编辑器选中节点之前的事件，返回值false时不可选中
    - `onDragover` `Function` 拖拽中判断是否允许放置
- **slot :**
  - left 左侧视图
  - right 右侧视图

## 模块

### explorer
> 组件管理器

#### 组件

##### ExplorerView

- **Props:**
  - `components` `Array` 组件选项
     - `id` 分组id
     - `title` 分组标题
       - `id` 组件id
       - `title` 组件标题
       - `node` 模板
- 用法
```vue
<template>
  <Designer>
      <template #left>
        <ExplorerView  :components="components"></ExplorerView>
      </template>
  </Designer>
</template>
<script>
  export default {
    data(){
      return {
        components:[{
           id:'1',
           title: '分组1',
           children:[{
             id:'1-1',
             title:'输入框',
             node:'<i-input/>'//任意单节点的合法vue片段
           }]
       }]
      }
    }
  }
</script>
```

### panels
> 面板

#### 组件

##### PanelView

- **Props:**
  - `groups` `Array` 分组
    - `title` `String` 标题
    - 'panels' 'Array' 通过registerPanel注册的panelID
- 用法
```vue
<template>
  <Designer>
      <template #left>
        <ExplorerView  :components="components"></ExplorerView>
      </template>
      <template #right>
        <PanelView id="childPanelView" title="组件选项" :groups="groups1"></PanelView>
        <PanelView id="pagePanelView" title="页面选项" :groups="groups2"></PanelView>
      </template>
  </Designer>
</template>

<script>
  export default {
    data(){
      return {
        components:[{
           id:'1',
           title: '分组1',
           children:[{
             id:'1-1',
             title:'输入框',
             node:'<i-input/>'//任意单节点的合法vue片段
           }]
        }],
        groups1: [
          {
            title: '选项',
            panels: ['TextPanel', 'PropsPanel', 'OptionEditorPanel'],
          },
        ],
        groups2: [
          {
            title: 'data',
            panels: ['DataPanel'],
          },
        ],
      }
    }
  }
</script>
```

###### 扩展方法
- registerPanel
  - 功能 注册面板
  - 参数
    - panelId
    - VueCompoent
      - panelTools Array
        ```javascript
            [
              {
                icon: 'md-add',
                handler() {
                  this.editData();
                },
              },
            ]
        ```

### data
> 对应vue中的data属性，
- panelId:`DataPanel`

### computed
> 对应vue中的computed属性
- panelId:`ComputedPanel`

### watch
> 对应vue中的watch属性
- panelId:`WatchPanel`

### methods
> 对应vue中的methods属性
- panelId:`MethodPanel`

### props
> vNode的prop设置
- panelId:`PropsPanel`

### events
> vNode的事件设置
- panelId:`EventPanel`

### directive
> vNode的directive设置
- panelId:`DirectivePanel`

### style
> vNode的内联样式设置
- panelId:`StylePanel`

### text
> 文本节点设置
- panelId:`TextPanel`

### optionEditor （新增）
> 为下拉框、单选框等包含选项的组件提供的选项编辑器
- panelId:`OptionEditorPanel`

#### 在vucConfig中的配置
- `optionEditor`
  - `tag` `string` 选项标签
  - `getData` `Function` 获取选项内容
  - `setData` `Function` 设置选项内容
- 用法
```javascript
export default {
  optionEditor: {
    tag: 'i-option',
    getData(node) {
      return {
        value: node.getAttr('value'),
        label: node.getAttr('label') || node.getText(),
      };
    },
    setData(node, data) {
      node.setAttr('value', data.value);
      if (node.hasAttr('label')) {
        node.setAttr('label', data.label);
      }else{
        node.replaceText(data.label)
      }
    },
  },
}
```

### combo
> 为一组模板组合类组件的提供快速配置功能
- panelId:`ComboPanel`

例如FormItem下面有一个Input，我们希望在进行操作时是操作这一整个组合，无需单独选中每个节点进行设置
```vue
<template>
  <FormItem prop="name">
    <Input v-model="formData.name"></Input>
  </FormItem>
</template>
```

- 注册组合

```javascript

Designer.registerComboTemplate({
 id: 'FormItem',
 name: '表单项',
 template:`<form-item key="formItem">
     <type.input key="input" allowChildren="true"/>
   </form-item>`,
 configs() {
   return [
     {
       node: 'formItem',
       mode: 'prop',
       props: {
         name: 'prop',
         label: '字段名',
       },
       on: {
         'on-change'(combo, data, vucAst) {
           let input = combo.nodeMap.input;
           let model = input.closest('i-form').getDynamicAttr('model');
           let expr = '';
           if (data.value) {
             expr = [model, data.value].join('.');
           }
           input.setDirective({
             name: 'model',
             value: expr,
           });

           vucAst.addChildData(model, {
             id: data.value,
             name: '',
             code: 'null',
           });

         },
       },
     },
     {
       node: 'input',
       mode: 'prop',
       props: {
         name: 'size',
         label: '尺寸',
       },
     },
     {
       node: 'input',
       mode: 'optionEditor',
     },
   ];
 },
})
```
