<template>
  <ButtonGroup v-show="isShow" class="vuc-tag-tools" :style="navPosStyle" vertical size="small"
               style="width: 30px;">
    <Button @mousedown.left.native="dropStart" type="primary" icon="md-move" title="移动"></Button>
    <Button @click="selectParent" type="primary" icon="md-arrow-up" title="选中父级容器"></Button>
    <Button @click="moveToBefore" type="primary" icon="md-arrow-dropup" title="前移"></Button>
    <Button @click="moveToAfter" type="primary" icon="md-arrow-dropdown" title="后移"></Button>
    <Button @click="remove" type="primary" icon="md-trash" title="删除"></Button>
  </ButtonGroup>
</template>

<script>

  export default {
    data() {
      return {
        navPos: {
          top: 0,
          left: -100,
        },
      };
    },
    computed: {
      isShow() {
        return this.currentNode && this.currentNode.parent;
      },
      currentNode() {
        return this.$parent.currentNode;
      },
      navPosStyle() {
        return {
          top: this.navPos.top - this.$parent.scrollTop + 'px',
          left: this.navPos.left - this.$parent.scrollLeft + 'px',
        };
      },
    },
    created() {
      setInterval(() => {
        this.updatePos();
      }, 1000 / 60);
    },
    watch: {
      currentNode() {
        this.$nextTick(() => {
          this.updatePos();
        });
      },
    },
    methods: {
      updatePos() {
        let vuc = this.currentNode;
        if (vuc) {
          let rootRect = this.$parent.$el.querySelector('.vuc-ceditor').getBoundingClientRect();
          let el = this.$parent.currentSelectElement || this.$parent.getVucNodeElement(vuc);

          if (el) {
            let rect = el.getBoundingClientRect();
            this.navPos = {
              top: rect.top - rootRect.top - 1 + this.$parent.scrollTop,
              left: rect.right - rootRect.left + 1 + this.$parent.scrollLeft,
            };
            let width = this.$parent.$el.querySelector('.app-wrapper').scrollWidth;
            this.navPos.left = Math.min(this.navPos.left, width - 10);

            // el.focus();

            return;
          }
        }

      },

      dropStart(e) {
        let vucNode = this.currentNode;
        let el = this.$parent.getVucNodeElement(vucNode);
        let rect = el.getBoundingClientRect();

        this.$parent.dropStart(e, {
          node: vucNode,
          tag: vucNode.tag,
        }, {
          x: 0,
          y: 0,
          width: rect.width + 'px',
          height: rect.height + 'px',
        });
      },

      moveToBefore() {
        this.$parent.applyApi('moveToBefore', this.currentNode);
      },

      moveToAfter() {
        this.$parent.applyApi('moveToAfter', this.currentNode);
      },

      remove() {
        this.$parent.applyApi('removeNode', this.currentNode);
      },

      selectParent() {
        let vucNode = this.currentNode;
        if (vucNode.parent) {
          this.$parent.selectVucNode(vucNode.parent);
        }
      },
    },
  };
</script>
