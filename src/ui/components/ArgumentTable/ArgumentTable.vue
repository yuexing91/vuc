<template>
  <div>
    <i-table :columns="argsOption" :data="value" border max-height="184" @on-row-dblclick="changeEditArg"></i-table>
    <i-button type="dashed" @click="addArg" icon="md-add" style="margin-top:10px; ">新增参数</i-button>
  </div>
</template>
<script type="text/jsx">

  export default{
    props: {
      value: Array,
    },
    data(){

      const render = (h, obj) => {
        if (obj.index == this.curEditArgIndex) {
          return h('i-input', {
            props: {
              value: this.value[obj.index][obj.column.key]
            },
            on: {
              input: (v) => {
                this.value[obj.index][obj.column.key] = v;
              }
            }
          })
        }
        return h('span', this.value[obj.index][obj.column.key])
      }

      return {
        curEditArgIndex: -1,
        argsOption: [
          {
            title: '参数名',
            key: 'id',
            render
          },
          {
            title: '说明',
            key: 'desc',
            render
          },
          {
            title: '是否必填',
            key: 'req',
            width: 100,
            render: (h, obj) => {
              if (obj.index == this.curEditArgIndex) {
                return h('checkbox', {
                  props: {
                    value: this.value[obj.index][obj.column.key]
                  },
                  on: {
                    input: (v) => {
                      this.value[obj.index][obj.column.key] = v;
                    }
                  }
                })
              }
              return h('span', this.value[obj.index].req ? '必填' : '')
            }
          },
          {
            title: '操作',
            key: 'id1',
            width: 120,
            render: (h, obj) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this.changeEditArg(obj.index)
                    }
                  }
                }, obj.index == this.curEditArgIndex ? '保存' : '编辑'),
                h('Divider', {
                  attrs: { type: 'vertical' },
                }),
                h('a', {
                  on: {
                    click: () => {
                      this.deleteEditArg(obj.index)
                    }
                  }
                }, '删除'),
              ])
            }
          }]
      }
    },
    methods: {
      addArg(){
        this.value.push({
          id: 'arg' + this.value.length,
          desc: undefined,
          req: false,
        })
        this.curEditArgIndex = this.value.length - 1;
      },

      changeEditArg(row, index){
        index                = _.isNumber(index) ? index : row;
        this.curEditArgIndex = this.curEditArgIndex != index ? index : -1
      },

      deleteEditArg(index){
        this.value.splice(index, 1);
      },
    }
  }

</script>
