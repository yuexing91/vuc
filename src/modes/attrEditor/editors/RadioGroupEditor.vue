<template>
  <RadioGroup v-model="val">
    <Radio  v-for="item in items"
            :label="item.value" :key="item.value">
      {{item.label}}
    </Radio>
  </RadioGroup>
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
    editorConfig: {
      id: 'radio-group',
      type: 'radio-group',
      name: '选项',
      dynamic: false,
    }
  }
</script>
