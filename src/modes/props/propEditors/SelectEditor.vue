<template>
  <Select
    v-model="val"
    :clearable="true">
    <Option v-for="item in items"
            :value="item.value"
            :key="item.value"
            :label="item.label"></Option>
  </Select>
</template>
<script>
  export default{
    props: {
      value: String,
      items: Array
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
        if (this.val !== this.value) {
          this.$emit('input', this.val)
        }
      }
    },
    propEditorConfig: {
      id: 'PropSelectEditor',
      type: 'select',
      name: '选项',
      dynamic: false,
    }
  }
</script>
