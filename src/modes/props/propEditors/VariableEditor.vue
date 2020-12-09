<template>
  <Select
    v-model="val"
    :clearable="true">
    <OptionGroup v-if="children.length>0" v-for="(children,group) in variables" :label="group" :key="group">
      <Option v-for="child in children" :value="child" :key="child" :label="child"></Option>
    </OptionGroup>
  </Select>
</template>
<script>
  export default{
    props: {
      value: String,
      variables: Object
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
      id:'PropVariableEditor',
      type: 'variable',
      name: '变量',
      dynamic: true,
      props(){
        return {
          variables:this.variables
        }
      }
    }
  }
</script>
