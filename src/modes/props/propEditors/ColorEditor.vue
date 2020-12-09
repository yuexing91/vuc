<template>
  <ColorPicker v-model="val" :clearable="true" :alpha="true" :recommend="true"/>
</template>
<script>
  export default{
    props: {
      value: String,
      type: String
    },
    data(){
      return {
        val: this.value || ''
      }
    },
    watch: {
      value(){
        this.val = this.value || '';
      },
    },
    methods: {
      changeValue(){
        this.$emit('input', this.val)
      }
    },
    propEditorConfig: {
      id: 'PropColorEditor',
      type: 'color',
      name: '颜色',
      dynamic: false,
    }
  }
</script>
