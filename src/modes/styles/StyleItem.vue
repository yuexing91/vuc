<template>
  <div class="vuc-style-item" :class=" item.comment ? 'vuc-style-nocomment' : 'vuc-style-comment' ">

    <input
      type="checkbox"
      class="vuc-style-checkbox"
      v-model="item.comment"
      @change="$emit('editover', item)" @click.stop/>

    <StyleCode v-model="item.k"
               @click.native.stop
               :editstate="eType=='key'"
               @enter="onEnterKey"
               @editover="changeKey"/>

    <span class="vuc-style-colon" @click.stop>:</span>

    <StyleCode v-model="item.v"
               @click.native.stop
               :editstate="eType=='value'"
               @enter="onEnterValue"
               @editover="changeValue"/>

    <span class="vuc-style-colon" @click.stop>;</span>
  </div>
</template>
<script>
  import StyleCode from './StyleCode';

  export default {
    props: {
      item: Object,
      editType: {
        type: String,
        default: '',
      },
    },
    components: {
      StyleCode,
    },
    data() {
      return {
        eType: this.editType,
      };
    },
    watch: {
      editType(editType) {
        this.eType = editType;
      },
    },
    methods: {
      changeKey() {
        this.$emit('editover', this.item);
      },
      changeValue() {
        this.$emit('editover', this.item);
      },
      onEnterKey() {
        this.eType = 'value';
      },
      onEnterValue() {
        this.eType = undefined;
        this.$emit('enter-value', this.item);
      },
    },
  };

</script>
<style lang="less">
  .vuc-style {
    &-checkbox {
      visibility: hidden;
    }

    &-comment, &-inline:hover {
      .vuc-style-checkbox {
        visibility: visible;
      }
    }

    &-comment {
      span {
        text-decoration: line-through;
      }
    }

    &-item {
      text-decoration-line: none;
      font-size: 0px;
      font-family: Monaco;

      & > * {
        vertical-align: middle;
      }
    }

    &-colon {
      font-size: 14px;
      font-weight: 600;
      margin: 0 2px;
    }

    &-checkbox {
      margin-right: 4px;
    }

  }

</style>
