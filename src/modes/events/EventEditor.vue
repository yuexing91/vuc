<template>
  <Form :label-width="100" :model="event" :rules="ruleValidate" ref="form">

    <FormItem label="事件类型" prop="id">
      <Select v-model="event.id">
        <OptionGroup v-for="group in eventGroups"
                     :label="group.name"
                     :key="group.name">
          <Option v-for="eve in group.events"
                  :value="eve.id"
                  :label="eve.label || eve.id"
                  :key="eve.id">
            <span>{{eve.label || eve.id}}</span>
            <span style="color:#aaa">{{eve.desc}}</span>
          </Option>
        </OptionGroup>
      </Select>
    </FormItem>

    <FormItem label="事件修饰符">
      <Select v-model="event.modifiers" multiple>
        <Option v-for="modifier in modifiers"
                :value="modifier.id"
                :label="modifier.id"
                :key="modifier.id">
          <span>{{modifier.id}}</span>
          <span style="color:#aaa">{{modifier.desc}}</span>
        </Option>
      </Select>
    </FormItem>

    <FormItem label="按键修饰符" v-if="showKeyModifier">
      <Select v-model="event.keyModifier">
        <Option v-for="modifier in keyModifiers"
                :value="modifier.id"
                :label="modifier.id"
                :key="modifier.id">
        </Option>
      </Select>
    </FormItem>

    <FormItem label="鼠标修饰符" v-if="showMouseModifier">
      <Select v-model="event.mouseModifier">
        <Option v-for="modifier in mouseModifiers"
                :value="modifier.id"
                :label="modifier.id"
                :key="modifier.id">
        </Option>
      </Select>
    </FormItem>

    <FormItem label="系统修饰" v-if="showSysModifier">
      <Select v-model="event.sysModifiers" multiple>
        <Option v-for="modifier in sysModifiers"
                :value="modifier.id"
                :label="modifier.id"
                :key="modifier.id">
        </Option>
      </Select>
    </FormItem>

    <FormItem label="脚本" prop="code">
      <Select v-model="type">
        <Option v-for="method in methods" :key="method.id" :value="method.id" :label="method.name || method.id">
          <span>{{method.id}}</span>
          <span style="color:#aaa" v-if="method.name">{{method.name}}</span>
        </Option>
        <Option :value="customCode" label="自定义">自定义</Option>
      </Select>
      <VucCodeEditor v-if="type==customCode" v-model="event.code" style="margin-top: 10px;"></VucCodeEditor>
    </FormItem>

  </Form>
</template>
<script>
  import _ from 'lodash'

  import {
    getHtmlEvents,
    getComponentEvents,
    EVENT_MODIFIERS,
    SYS_MODIFIERS,
    KEY_MODIFIERS,
    MOUSE_MODIFIERS
  } from './eventConfig';

  export default{
    props: {
      methods: Array,
      event: Object,
      eventTypes: Array,
      isHTML: Boolean
    },
    data(){
      return {
        ruleValidate: {
          id: [
            { required: true, message: '事件类型必选' },
          ],
          code: [
            { required: true, message: '代码必填', trigger: 'blur' },
          ],
        },
        modifiers: EVENT_MODIFIERS,
        sysModifiers: SYS_MODIFIERS,
        keyModifiers: KEY_MODIFIERS,
        mouseModifiers: MOUSE_MODIFIERS,
        type: '',
        customCode: 'custom code'
      }
    },
    computed: {

      eventGroups(){
        if (this.isHTML) {
          return getHtmlEvents();
        }
        return [{
          name: '组件事件',
          events: this.eventTypes
        }].concat(getComponentEvents());
      },

      eventConfig(){
        return this.findEvent(this.event.id);
      },

      showKeyModifier(){
        return this.eventConfig && this.eventConfig.keyModifier;
      },

      showMouseModifier(){
        return this.eventConfig && this.eventConfig.mouseModifier;
      },

      showSysModifier(){
        return this.showKeyModifier || this.showMouseModifier;
      },

    },

    watch: {
      type(type){
        if (type != this.customCode) {
          this.event.code = type;
        }
      },
      event(){
        if (_.find(this.methods, { id: this.event.code })) {
          this.type = this.event.code;
        } else {
          this.type = this.customCode;
        }
      }
    },

    methods: {
      validate(){
        return this.$refs.form.validate();
      },
      findEvent(id){
        return _.flatMap(this.eventGroups, 'events').find(event => event.id == id)
      }
    },

  }
</script>
