<template>
  <Select
    v-model="val"
    :clearable="true">
    <OptionGroup v-if="children.length>0"
                 v-for="(children,group) in getVariables()"
                 :label="group"
                 :key="group">
      <Option v-for="child in children" :value="child" :key="child" :label="child"></Option>
    </OptionGroup>
  </Select>
</template>
<script>
  import _ from 'lodash';

  export default {
    inject: ['$designer'],
    props: {
      value: String,
    },
    data() {
      return {
        val: this.value,
      };
    },
    watch: {
      value() {
        this.val = this.value;
      },
      val() {
        if (this.val !== this.value) {
          this.$emit('input', this.val);
        }
      },
    },

    methods: {
      getVariables() {
        let vucAst = this.$designer.vucAst;
        if (!( vucAst && vucAst.vucInstance )) {
          return [];
        }

        function keys(obj) {
          if (obj) {
            return Object.keys(obj);
          }
          return [];
        }

        let vueOptions = vucAst.vucInstance.$options;
//        let scopes = this.currentNode.getScopeVariables();

        return {
//          scopes: _.map(scopes, 'alias'),
          props: keys(vueOptions.props),
          data: _.map(vucAst.VucDatas, 'id'),
//          data: _.union(keys(vucAst.vucInstance.$data), _.map(vucAst.VucDatas, 'id')),
          computed: keys(vueOptions.computed),
          methods: keys(vueOptions.methods),
        };
      },
    },
    editorConfig: {
      id: 'variable',
      type: 'variable',
      name: '变量',
      dynamic: true,
    },
  };
</script>
