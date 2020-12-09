<template>
  <VucCollapsePanel title="选项" v-if="!textNode">

    <Form :class="{'props-advanced-open':showAdvancedProps}" label-position="top" style="margin-top: 10px;">

      <PropItem v-for="prop in showProps"
                :key="prop.name"
                :prop="prop"
                :variables="variables"
                @on-change="savePropData"></PropItem>

      <a class="props-advanced-btn"
         v-show="hasAdvancedProps"
         @click="showAdvancedProps=!showAdvancedProps">{{showAdvancedProps ? '收起' : '展开'}}高级选项
        <Icon type="ios-arrow-down"></Icon>
      </a>

    </Form>

  </VucCollapsePanel>
</template>
<script>
  import _ from 'lodash';

  import PropItem from './PropItem.vue';

  import designerMixins from '../designerMixins.js';

  export default {
    components: {
      PropItem,
    },

    mixins: [designerMixins],

    data() {
      return {
        showAdvancedProps: false,
      };
    },

    computed: {

      VucConfig() {
        if (!this.currentNode) {
          return [];
        }
        return this.$designer.getVucConfig(this.currentNode.tag);
      },

      props() {
        const createConfig = (config, propName) => {
          let value = attrsMap[propName];
          let dynamic = false;
          if (_.has(attrsMap, ':' + propName)) {
            dynamic = true;
            value = attrsMap[':' + propName];
          }

          return Object.assign(_.find(_props, { name: propName }) || { editorType: undefined }, {
            label: config.label,
            value,
            dynamic,
            name: propName,
            config,
          });
        };
        const vucNode = this.currentNode;
        if (!vucNode) {
          return [];
        }

        const attrsMap = vucNode.attrsMap;
        const VucConfig = this.VucConfig;
        if (!VucConfig) {
          return [];
        }

        const _props = vucNode._props;

        const props = _.map(VucConfig.props, createConfig);

        /*props.unshift(createConfig({
          label: '可移动',
          editors: {
            type: 'boolean',
            default: true,
          }
        }, '_move'))*/

        vucNode._props = props;

        return props;
      },

      showProps() {
        if (this.showAdvancedProps) {
          return this.props;
        }
        return this.props.filter(prop => !prop.config.advanced);
      },

      hasAdvancedProps() {
        return !!this.props.find(prop => prop.config.advanced);
      },

      variables() {
        if (!( this.vucAst && this.vucAst.vucInstance )) {
          return [];
        }

        function keys(obj) {
          if (obj) {
            return Object.keys(obj);
          }
          return [];
        }

        let vueOptions = this.vucAst.vucInstance.$options;
        let scopes = this.currentNode.getScopeVariables();

        return {
          scopes: _.map(scopes, 'alias'),
          props: keys(vueOptions.props),
          data: _.union(keys(this.vucAst.vucInstance.$data), _.map(this.vucAst.VucDatas, 'id')),
          computed: keys(vueOptions.computed),
          methods: keys(vueOptions.methods),
        };
      },
    },

    methods: {

      savePropData(propData) {

        let _props = this.currentNode._props;

        _.find(_props, { name: propData.name }).editorType = propData.editorType;


        let isChange = this.currentNode.setAttr(propData.name, propData.value, propData.dynamic);
//        let attrsMap = this.currentNode.attrsMap;
//        let setKey = propData.name, deleteKey = ':' + propData.name;
//        if (propData.dynamic) {
//          setKey = ':' + propData.name, deleteKey = propData.name;
//        }
//
//        this.$delete(attrsMap, deleteKey);
//        if (( propData.value === undefined || propData.value === '' ) && _.has(attrsMap, setKey)) {
//          isChange = true;
//          this.$delete(attrsMap, setKey);
//        } else if (attrsMap[setKey] !== propData.value) {
//          isChange = true;
//          this.$set(attrsMap, setKey, propData.value);
//        }

        let watchers = this.VucConfig.watchers;
        if (isChange && watchers && watchers[propData.name]) {
          watchers[propData.name](this.currentNode, propData.value, propData.dynamic);
        }
      },

    },
  };
</script>
<style lang="less">
  .props-advanced-btn {
    display: block;
    margin: 0 auto;
    padding: 4px;
    text-align: center;
    font-size: 12px;

    i {
      transition: all .2s ease-in-out;
    }
  }

  .props-advanced-open {
    .props-advanced-btn {
      i {
        transform: rotate(180deg);
      }
    }
  }
</style>
