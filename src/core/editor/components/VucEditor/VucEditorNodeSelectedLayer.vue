<template>
  <div class="vuc-selected-layer" :style="layerPosStyle" v-if="currentNode">
    <div class="vuc-selected-layer-name">{{currentNode.tag || '文本'}}</div>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        layerPos: {},
      };
    },
    computed: {
      currentNode () {
        return this.$parent.currentNode;
      },
      layerPosStyle () {
        return {
          top: this.layerPos.top - this.$parent.scrollTop + 'px',
          left: this.layerPos.left - this.$parent.scrollLeft + 'px',
          width: this.layerPos.width + 'px',
          height: this.layerPos.height + 'px',
        };
      },
    },
    created () {
      setInterval(() => {
        this.updatePos();
      }, 1000 / 60);
    },
    watch: {
      currentNode () {
        this.$nextTick(() => {
          this.updatePos();
        });
      },
    },
    methods: {
      updatePos () {
        let vuc = this.currentNode;
        if (vuc) {
          let rootRect = this.$parent.$el.querySelector('.vuc-ceditor-panle').getBoundingClientRect();
          let el = this.$parent.currentSelectElement || this.$parent.getVucNodeElement(vuc);

          if (el) {
            let rect = el.getBoundingClientRect();
            this.layerPos = {
              top: rect.top - rootRect.top + this.$parent.scrollTop,
              left: rect.left - rootRect.left + this.$parent.scrollLeft,
              width: rect.width,
              height: rect.height,
            };
            return;
          }
        }

      },

    },
  };
</script>
