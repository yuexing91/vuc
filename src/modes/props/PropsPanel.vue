<template>
  <div class="vuc-mode-view" v-if="!textNode">
    <div :class="{'props-advanced-open':showAdvancedProps}"
          style="margin-top: 10px;">

      <PropItem
          v-for="prop in showProps"
          :key="prop.name"
          :name="prop.name"
          :vucNode="currentNode"/>

      <a class="props-advanced-btn"
         v-show="hasAdvancedProps"
         @click="showAdvancedProps=!showAdvancedProps">
        {{showAdvancedProps ? '收起' : '展开'}}高级选项
        <Icon type="ios-arrow-down"/>
      </a>

    </div>
  </div>
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

      props() {
        let vucNode = this.currentNode;
        if (!vucNode) {
          return [];
        }

        let VucConfig = this.currentNode.getConfig();
        if (!VucConfig) {
          return [];
        }

        let props = _.map(VucConfig.props, (config, name) => {
          return {
            name,
            advanced: config.advanced ? 1 : 0,
          };
        });

        return _.sortBy(props, 'advanced');
      },

      showProps() {
        if (this.showAdvancedProps) {
          return this.props;
        }
        return this.props.filter(prop => !prop.advanced);
      },

      hasAdvancedProps() {
        return !!this.props.find(prop => prop.advanced);
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
