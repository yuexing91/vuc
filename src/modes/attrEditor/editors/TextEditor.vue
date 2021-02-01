<template>
  <Input v-model="val" :clearable="true" :type="type"
         @on-blur="changeValue"
         @on-clear="changeValue()"/>
</template>
<script>
  export default{
    props: {
      value: String,
      type: String
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
        this.$emit('input', this.val)
      }
    },
    editorConfig: {
      id: 'text',
      type: 'text',
      name: '字符串',
      dynamic: false,
    }
  }
</script>
