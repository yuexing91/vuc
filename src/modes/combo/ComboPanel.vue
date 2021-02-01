<template>
  <div class="vuc-mode-view" v-if="comboOptions">
    <component
      v-for="(option,index) in comboOptions"
      :is="getComponent(option)"
      v-on="getEvents(option)"
      v-bind="getComponentProps(option)"
      :key="option.node._astId + '-' + index">
    </component>
  </div>
</template>

<script>

  import _ from 'lodash';
  import { findCombo } from './comboManager';
  import PropItem from '../props/PropItem';
  import OptionEditorPanel from '../optionEditor/OptionEditorPanel.vue';
  import designerMixins from '../designerMixins.js';

  let ComponentMap = {
    prop: PropItem,
    optionEditor: OptionEditorPanel,
  };

  export default {

    mixins: [designerMixins],

    data() {
      return {
        combo: null,
      };
    },

    computed: {
      comboOptions() {
        return this.combo ? this.combo.getOptionConfigs() : '';
      },
      name() {
        return this.combo ? this.combo.getName() : '';
      },
    },

    watch: {
      currentNode(node) {
        this.combo = node ? findCombo(node) : null;
      },
    },

    methods: {
      getComponent(option) {
        return ComponentMap[option.mode];
      },

      getComponentProps(option) {
        let node = this.combo.getNode(option.node);
        return Object.assign({ vucNode: node }, option.props);
      },

      getEvents(option) {
        return _.mapValues(option.on, fn => {
          return (event) => {
            fn.call(this, this.combo, event, this.vucAst);
          };
        });
      },

    },
  };

</script>

<style lang="less">
  .v-title {
    position: relative;
    height: 34px;
    line-height: 34px;

    &:before {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      background: #ddd;
      position: absolute;
      top: 17px;
      left: 0;
    }

    span {
      display: inline-block;
      background: #fff;
      padding: 0 10px;
      position: relative;
      margin-left: 30px;
      font-size: 14px;
    }
  }
</style>
