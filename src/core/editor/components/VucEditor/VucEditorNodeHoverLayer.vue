<template>
  <div v-if="hoverVucNode" class="vuc-hover-layer" :style="posStyle">
    <div class="vuc-hover-layer-name">{{hoverVucNode.tag || '文本'}}</div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        pos: {
          top: 0,
          left: -100,
        },
      };
    },
    computed: {
      hoverVucNode() {
        return this.$parent.hoverVucNode;
      },
      posStyle() {
        return {
          top: this.pos.top - this.$parent.scrollTop + 'px',
          left: this.pos.left - this.$parent.scrollLeft + 'px',
          width: this.pos.width + 'px',
          height: this.pos.height + 'px',
        };
      },
    },
    watch: {
      hoverVucNode() {
        this.$nextTick(() => {
          this.updatePos();
        });
      },
    },
    methods: {
      updatePos() {
        let vuc = this.hoverVucNode;
        if (vuc) {
          let rootRect = this.$parent.$el.querySelector('.vuc-ceditor-panle').getBoundingClientRect();
          let el = this.$parent.hoverVucNodeEl || this.$parent.getVucNodeElement(vuc);

          if (el) {
            let rect = el.getBoundingClientRect();
            this.pos = {
              top: rect.top - rootRect.top + this.$parent.scrollTop,
              left: rect.left - rootRect.left + this.$parent.scrollLeft,
              width: rect.width,
              height: rect.height,
            };
          }
        }

      },
    },
  };
</script>
