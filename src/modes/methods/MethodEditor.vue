<template>
  <Form :label-width="80" :model="method" :rules="ruleValidate" ref="form">
    <FormItem label="标识" prop="id">
      <Input v-model="method.id" placeholder="请输入标识"></Input>
    </FormItem>
    <FormItem label="名称" prop="name">
      <Input v-model="method.name" placeholder="请输入名称"></Input>
    </FormItem>
    <FormItem label="参数列表">
      <VucArgumentTable :value="method.params"></VucArgumentTable>
    </FormItem>
    <FormItem label="代码" prop="bodyCode">
      <VucCodeEditor v-model="method.bodyCode"></VucCodeEditor>
    </FormItem>
  </Form>
</template>

<script>

  import _ from 'lodash'

  export default{
    props: {
      method: Object,
    },
    data(){
      return {
        ruleValidate: {
          id: [
            { required: true, message: '标识必填', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '代码必填', trigger: 'blur' },
          ],
        },
      }
    },

    methods: {
      validate(){
        return this.$refs.form.validate()
      },
    },

  }
</script>
