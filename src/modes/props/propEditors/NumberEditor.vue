<template>
  <InputNumber
    :max="max"
    :min="min"
    :activeChange="activeChange"
    v-model="val"></InputNumber>
</template>
<script>
  import _ from 'lodash';

  export default{
    props: {
      value: [Number, String],
      max: {
        type: Number,
      },
      min: {
        type: Number,
      },
      activeChange: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        val: undefined
      }
    },
    watch: {
      value: {
        handler(){
          if (_.isString(this.value)) {
            this.val = parseInt(this.value);
            return;
          }
          this.val = _.isUndefined(this.value) ? null : this.value;
        },
        immediate: true
      },
      val(){
        this.$emit('input', this.val)
      }
    },
    propEditorConfig: {
      id: 'PropNumberEditor',
      type: 'number',
      name: '数字',
      dynamic: true,
    }
  }
</script>
