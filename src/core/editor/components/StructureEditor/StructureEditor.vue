<template>
  <div class="vuc-structure" :class="cls">

    <template v-if="openState">
      <div class="vuc-structure-header">元素
        <a @click="toggleState" class="vuc-structure-header-extra">
          <Icon type="md-contract"/>
        </a>
      </div>

      <div class="vuc-structure-body">
        <Tree :data="ast" :render="renderContent"></Tree>
        <VucContextMenu
          v-model="showMenu"
          :items="contenxtMenuItems"
          :style="contextMenuStyle"
          @click-item="handleMenu"></VucContextMenu>
      </div>
    </template>

    <Tooltip v-else content="显示页面结构">
      <a @click="toggleState">
        <Icon type="md-expand"/>
      </a>
    </Tooltip>

  </div>
</template>
<script>
  import VueNode from './VueNode.vue';

  import dropMixin from './structureDrop';
  import { createMenus } from '../../contextMenus';

  export default {
    provide () {
      return {
        $Structure: this,
      };
    },

    mixins: [dropMixin],

    data () {
      return {
        showMenu: false,
        contextMenuStyle: {},
        openState: true,
      };
    },

    computed: {

      curVucNode () {
        return this.activeEditor.currentNode;
      },

      cls () {
        return this.openState ? '' : 'vuc-structure-close';
      },

      ast () {
        if (this.activeEditor.vucAst) {
          return [this.activeEditor.vucAst.rootNode];
        }
      },

      contenxtMenuItems () {
        return createMenus(this.curVucNode);
      },

      activeEditor () {
        return this.$parent;
      },

    },

    methods: {

      toggleState () {
        this.openState = !this.openState;
      },

      renderContent (h, { root, node, data }) {
        return h(VueNode, {
          props: {
            node: data,
          },
          class: {
            'vue-node-selected': data == this.curVucNode,
          },
        });
      },

      selectNode (node) {
        if (this.curVucNode === node) {
          return;
        }
        this.activeEditor.selectVucNode(node);
      },

      handleMenu (item) {
        item.handler(this.curVucNode, this.activeEditor);
      },

      showContextMenu (e, node) {
        this.selectNode(node);
        const rect = this.$el.getBoundingClientRect();
        this.showMenu = true;
        this.contextMenuStyle = {
          top: (e.pageY - rect.y) + 'px',
          left: (e.pageX - rect.x) + 'px',
        };
      },

    },
  };
</script>

<style lang="less">
  .vuc-structure {
    position: relative;
    border-left: 1px solid #e8eaec;

    .ivu-tree-title-selected, .ivu-tree-title:hover {
      background: none;
    }

    &.vuc-structure-close {
      position: absolute;
      width: 22px !important;
      height: 22px !important;;
      background: #2d8cf0;
      top: 2px;
      right: 0px;
      border-radius: 50%;
      text-align: center;

      a {
        color: #fff;

        :hover {
          opacity: 0.8;
        }
      }
    }

    .vuc-structure-header {
      position: relative;
      padding: 4px 8px;
      color: #2d8cf0;
      border-bottom: 1px solid #e8eaec;
    }

    .vuc-structure-header-extra {
      position: absolute;
      font-size: 16px;
      right: 2px;
      top: 2px;
    }

    .vuc-structure-body {
      height: ~"calc(100% - 30px)";
      overflow: auto;
    }

    .ivu-tree ul li {
      margin: 0px 0;
    }
  }

  .vuc-structure-pos-proxy {
    position: absolute;
    height: 0px;
    border-top: 2px dashed red;
    pointer-events: none;
  }

  .vuc-structure-pos-proxy-inner {
    background: transparent;
    border: 2px dashed red;
  }

</style>
