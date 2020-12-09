<template>
  <Form :label-width="90" v-if="vucData">
    <row>
      <i-col :span="12">
        <FormItem label="标识">
          <Input v-model="vucData.id" placeholder=""/>
        </FormItem>
      </i-col>
      <i-col :span="12">
        <FormItem label="名称">
          <Input v-model="vucData.name" placeholder=""/>
        </FormItem>
      </i-col>
    </row>
    <FormItem label="表达式">
      <VucCodeEditor v-model="vucData.code" :height="300"></VucCodeEditor>
    </FormItem>
  </Form>
</template>
<script>

  export default {
    props: {
      vucData: Object,
      vucAst: Object,
    },
    computed: {
    },
    data() {
      return {};
    },
  };
</script>
