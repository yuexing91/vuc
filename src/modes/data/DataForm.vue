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
    <FormItem label="默认值">
      <VucCodeEditor v-model="vucData.code" :height="300"></VucCodeEditor>
    </FormItem>
    <!--<row>
      <i-col :span="12">
        <FormItem label="绑定数据源">
          <i-select v-model="vucData.dataSource.id" clearable>
            <i-option v-for="dataSource in VucDataSources" :value="dataSource.id" :key="dataSource.id">
              {{dataSource.name}}
            </i-option>
          </i-select>
        </FormItem>
      </i-col>
      <i-col :span="12">
        <FormItem label="字段">
          <i-select v-model="vucData.dataSource.property">
            <i-option v-for="k in dataSourceKeys" :value="k" :key="k">
              {{k}}
            </i-option>
          </i-select>
        </FormItem>
      </i-col>
    </row>-->
  </Form>
</template>
<script>

  export default {
    props: {
      vucData: Object,
      vucAst: Object,
    },
  };
</script>
