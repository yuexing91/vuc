<template>
  <div class="vuc-mode-view" v-if="textNode">
    <Input v-model="text" style="width: 100%" @on-blur="change"></Input>
  </div>
</template>

<script>

  import designerMixins from '../designerMixins.js';

  export default {

    mixins: [designerMixins],

    data() {
      return {
        text: '',
      };
    },

    watch: {
      currentNode(vucNode) {
        if (vucNode && vucNode.isText()) {
          this.text = vucNode.text;
        }
      },
    },

    methods: {
      change() {
        this.currentNode.text = this.text;
      },
    },
  };

</script>
