<template>
  <VucCodeEditor
    v-model="val"
    @change="changeValue"
    style="margin-top: 1px;"
    :inline="true"></VucCodeEditor>
</template>
<script>
  export default{
    props: {
      value: String,
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
    },
    methods: {
      changeValue(){
        if (this.val !== this.value) {
          this.$emit('input', this.val)
        }
      }
    },
    propEditorConfig: {
      id:'PropExpressionEditor',
      type: 'expression',
      name: '表达式',
      dynamic: true,
    }
  }
</script>
