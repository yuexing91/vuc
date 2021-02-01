<template>
  <div v-if="items" class="vuc-opteditor">
    <div class="v-title">
      <span>选项编辑</span>
    </div>

    <div v-for="(item,index) in items"
         class="vuc-opteditor-item"
         :key="index" style="">
      <i-input v-model="item.label"
               @on-change="change(item)"
               style="width: 49%"></i-input>
      <i-input v-model="item.value"
               @on-change="change(item)"
               style="width: 49%"></i-input>
      <Icon class="vuc-opteditor-item-close"
            size="18"
            @click="removeItem(item)"
            type="ios-close-circle"
            color="red"/>
    </div>

    <i-button
      @click="appendItem"
      size="small"
      type="dashed"
      long>新增一项</i-button>
  </div>
</template>

<script>

  import designerMixins from '../designerMixins.js';
  import VucNodeHelper from '@/helpers/VucNodeHelper.js';

  export default {

    props: {
      vucNode: Object,
    },

    mixins: [designerMixins],

    data() {
      return {
        items: null,
      };
    },

    watch: {
      vucNode: {
        handler(vucNode) {
          if (!vucNode) return;
          let optionEditor = vucNode.getConfig('optionEditor');
          if (optionEditor) {
            let optionNodes = vucNode.findChildren(optionEditor.tag);
            this.items = optionNodes.map(node => Object.assign(optionEditor.getData(node), { node }));
          } else {
            this.items = null;
          }
        },
        immediate: true,
      },
    },

    methods: {
      change(item) {
        let optionEditor = this.vucNode.getConfig('optionEditor');
        optionEditor.setData(item.node, item);
      },
      appendItem() {
        let optionEditor = this.vucNode.getConfig('optionEditor');

        let node = VucNodeHelper.createVucNode(`<${ optionEditor.tag }/>`);
        let item = {
          node,
          label: '选项' + this.items.length,
          value: '选项' + this.items.length,
        };
        this.items.push(item);

        this.vucNode.appendNode(node);
        this.change(item);
      },
      removeItem(item) {
        item.node.remove();
        this.items = this.items.filter(i => i != item);
      },
    },
  };

</script>

<style lang="less">
  .vuc-opteditor-item {
    margin-bottom: 10px;
    position: relative;

    &-close {
      position: absolute;
      right: -9px;
      top: -9px;
      display: none;
      cursor: pointer;
    }

    &:hover > &-close {
      display: inline-block;
    }

  }
</style>
