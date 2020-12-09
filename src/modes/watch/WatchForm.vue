<template>
  <Form :label-width="80" :model="data" :rules="ruleValidate" ref="form" v-if="data">
    <Row>
      <i-col :span="8">
        <FormItem label="标识" prop="id">
          <Input v-model="data.id" placeholder="请输入标识"></Input>
        </FormItem>
      </i-col>
      <i-col :span="8">
        <FormItem label="备注" prop="name">
          <Input v-model="data.name"></Input>
        </FormItem>
      </i-col>
      <i-col :span="4">
        <FormItem label="deep" prop="deep">
          <Checkbox v-model="data.deep"></Checkbox>
        </FormItem>
      </i-col>
      <i-col :span="4">
        <FormItem label="immediate" prop="immediate">
          <Checkbox v-model="data.immediate"></Checkbox>
        </FormItem>
      </i-col>
    </Row>
    <FormItem label="参数列表">
      <VucArgumentTable :value="data.params"></VucArgumentTable>
    </FormItem>
    <FormItem label="代码" prop="bodyCode">
      <VucCodeEditor v-model="data.bodyCode"></VucCodeEditor>
    </FormItem>
  </Form>
</template>
<script>

  export default {
    props: {
      data: Object,
      vucAst: Object,
    },
    data () {
      return {
        ruleValidate: {
          id: [
            {
              required: true,
              message: '标识必填',
              trigger: 'blur',
            },
          ],
          bodyCode: [
            {
              required: true,
              message: '代码必填',
              trigger: 'blur',
            },
          ],
        },
      };
    },
  };
</script>
