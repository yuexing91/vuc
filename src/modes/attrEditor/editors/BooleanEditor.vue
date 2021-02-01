<template>
  <Checkbox v-model="val" :trueValue="trueValue" :falseValue="falseValue">{{val ? trueText : falseText}}</Checkbox>
</template>
<script>
  export default{
    props: {
      value: [String, Number, Boolean],
      trueValue: {
        type: [String, Number, Boolean],
        default: true
      },
      falseValue: {
        type: [String, Number, Boolean],
        default: false
      },
      trueText: {
        type: String,
        default: '是'
      },
      falseText: {
        type: String,
        default: '否'
      }
    },
    data(){
      return {
        val: this.value
      }
    },
    watch: {
      value(){
        this.val = this.value;
      },
      val(){
        this.$emit('input', this.val)
      }
    },
    editorConfig: {
      id: 'boolean',
      type: 'boolean',
      name: '是否',
      dynamic: true,
    }
  }
</script>
