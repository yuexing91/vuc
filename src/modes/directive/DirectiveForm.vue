<template>
  <div>
    <Form :label-width="80">
      <FormItem label="指令">
        <i-select v-model="value.name" :disabled="readonly">
          <i-option v-for="direct in directiveSchemas" :value="direct.name" :key="direct.name">{{direct.name}}
          </i-option>
        </i-select>
      </FormItem>
      <FormItem label="功能" v-show="value.name">
        {{directive.describe}}
      </FormItem>
      <FormItem :label="prop.describe" v-for="(prop,index) in props" :key="index">
        <VucCodeEditor v-model="value[prop.name]" :inline="true"></VucCodeEditor>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  import { directiveSchemas, getDirectiveSchema } from './systemDirectives';

  export default{
    props: {
      value: Object,
      directives: Array
    },
    data(){
      return {
        readonly: false
      }
    },
    computed: {
      directive(){
        return getDirectiveSchema(this.value.name) || {};
      },
      props(){
        return this.directive.props;
      },
      directiveSchemas(){
        return directiveSchemas.filter(schema => {
          return !this.directives.find(dir => dir.name == schema.name)
        })
      }
    },
    watch: {
      value: {
        handler(newValue, oldValue){
          if (newValue === oldValue) return;
          if (this.value.name) {
            this.readonly = true;
          } else {
            this.readonly = false;
          }
        },
        immediate: true
      }
    }
  }
</script>
