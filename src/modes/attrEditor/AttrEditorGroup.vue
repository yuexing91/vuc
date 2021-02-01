<template>
  <div class="vuc-ae-group">

    <div class="vuc-ae-group-header">
      <span>{{ title }}</span>
      <RadioGroup class="vuc-ae-group-radio"
                  v-if="attrEditorConfigs.length>1"
                  v-model="data.editorId"
                  type="button"
                  size="small">
        <Radio v-for="editor in attrEditorConfigs"
               :key="editor.id"
               :label="editor.id"
               :title="editor.name">
          {{ editor.name.substr(0,1) }}
        </Radio>
      </RadioGroup>
    </div>

    <div>
      <component
        :is="getEditorComponent()"
        v-model="data.attrData[editorId]"
        @input="changeValue"
        v-bind="getEditorPropsData()"/>
      <Tooltip class="vuc-ae-group-help"
               placement="left"
               :transfer="true"
               v-if="helpContent">
        <div class="vuc-ae-group-help-content" slot="content" v-html="helpContent"/>
        <Icon type="md-help"/>
      </Tooltip>
    </div>

  </div>
</template>
<script>

  import _ from 'lodash';
  import { getEditorComponent, getEditorConfig, parseEditor } from './util';

  export default {
    props: {
      label: String,
      config: Object,
      data: Object,
      context: Object,
      editors: {
        type: Array,
        default() {
          return [];
        },
      },
    },

    data() {
      return {
        attrEditorConfigs: [],
      };
    },

    computed: {

      title() {
        return this.label || this.config.label;
      },

      editorId() {
        return this.data.editorId;
      },

      curEditor() {
        return _.find(this.attrEditorConfigs, { id: this.data.editorId });
      },

      helpContent() {
        return this.curEditor.help || this.config.help;
      },

    },

    watch: {
      editorId: 'changeEditor',
      data: {
        immediate: true,
        handler() {
          this.updateAttrEditors();
          this.updateAttrData();
        },
      },
    },

    methods: {

      getEditorComponent() {
        return getEditorComponent(this.editorId);
      },

      updateAttrEditors() {
        let editors = [];
        if (this.config.editors) {
          editors = _.castArray(this.config.editors);
        }

        this.attrEditorConfigs = editors.concat(this.editors).map(opts => {
          let editor = parseEditor(opts);
          let _editor = getEditorConfig(editor.type);
          return Object.assign({}, _editor, editor);
        });
      },

      updateAttrData() {
        let attrData = {};

        let data = this.data;
        if (data.attrData) {
          attrData = data.attrData;
        } else {
          this.attrEditorConfigs.forEach(editor => {
            attrData[editor.type] = undefined;
          });
          data.attrData = attrData;
        }

        let value = data.value;
        let dynamic = data.dynamic;
        let editorId = data.editorId;

        if (this.vaild(editorId, value, dynamic)) {
          attrData[editorId] = value;
        } else {
          editorId = null;
        }

        //自动判断editor
        if (_.isEmpty(editorId) && !_.isEmpty(value)) {
          let editor = _.find(this.attrEditorConfigs, { dynamic });
          if (editor) {
            editorId = editor.id;
          }
          if (editorId === 'variable') {
            editorId = value.match(/^[\$_a-z][\w\$]*$/i) ? 'variable' : 'expression';
          }
          if (editorId) {
            attrData[editorId] = value;
          }
        }

        //默认editor
        if (_.isEmpty(editorId)) {
          editorId = _.first(this.attrEditorConfigs).id;
        }

        //设置默认值
        if (!_.has(attrData, editorId)) {
          attrData[editorId] = _.find(this.attrEditorConfigs, { id: editorId }).default;
        }

        data.editorId = editorId;

      },

      getEditorPropsData() {
        if (this.curEditor.props && _.isFunction(this.curEditor.props)) {
          return this.curEditor.props.call(this, context);
        }
        return this.curEditor.props;
      },

      changeEditor(editorId) {
        this.data.editorId = editorId;
        if (this.data.attrData && this.data.attrData[editorId]) {
          this.changeValue();
        }
      },

      changeValue: _.debounce(function () {
        let data = this.data;
        this.$emit('on-change', {
          editorId: data.editorId,
          value: data.attrData[data.editorId],
          dynamic: this.curEditor.dynamic,
        });
      }, 100),

      //校验value是否合法
      vaild(editorId, value, dynamic) {
        if (editorId) {
          //TODO
          return true;
        }
      },

    },
  };
</script>
<style lang="less">
  .vuc-ae-group {
    position: relative;
    margin-bottom: 10px;

    &-radio {
      float: right;
    }

    &-header {
      line-height: 30px;
    }

    &-label {
      user-select: none;
      font-weight: 600;

      &:hover {
        color: #2d8cf0;
      }
    }


    &-help {
      line-height: 32px;
      position: absolute;
      top: 0px;
      right: -16px;

      &:hover {
        cursor: pointer;
        color: #5cadff;
      }
    }

    &-content {
      line-height: 40px;
      width: 230px;
      white-space: normal;

      & > code {
        background: #f7f7f7 !important;
        color: #666 !important;;
      }
    }

  }
</style>
