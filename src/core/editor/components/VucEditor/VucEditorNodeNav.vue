<template>
  <div class="vuc-ceditor-tagnav">
    <span class="vuc-ceditor-tag"
          :class="{'vuc-ceditor-tag-cur':node==currentNode}"
          v-for="node in nodes"
          @click="selectInstance(node)"
          @mousedown="onDropStart($event,node)"
          :key="node._astId">{{node.tag}}</span>
  </div>
</template>
<script>
  export default {
    computed: {
      currentNode () {
        return this.$parent.currentNode;
      },
    },
    data () {
      return {
        nodes: [],
      };
    },
    watch: {
      currentNode (currentSelections) {
        if (currentSelections && !this.nodes.includes(currentSelections)) {
          this.updateNodes();
        }
      },
    },
    methods: {
      updateNodes () {
        let nodes = [];
        let node = this.currentNode;
        while (node) {
          nodes.unshift(node);
          node = node.parent;
        }
        this.nodes = nodes;
      },
      onDropStart (e, node) {
        this.$parent.dropStart(e, node, {
          x: 0,
          y: 0,
          width: '100px',
          height: '30px',
        });
      },
      selectInstance (node) {
        this.$parent.selectVucNode(node);
      },
    },
  };
</script>
<style lang="less">
  .vuc-ceditor-tagnav {
    height: 24px;
    flex-shrink: 0;
    border-top: 1px solid #e8eaec;
    line-height: 24px;
    cursor: default;

    .vuc-ceditor-tag {
      display: inline-block;
      padding: 1px 5px;
      background: #f7f7f7;
      border-radius: 3px;
      color: #515a6e;

      &:hover {
        background: #e8eaec;
      }
    }

    .vuc-ceditor-tag-cur {
      color: #2d8cf0;
    }
  }


</style>
