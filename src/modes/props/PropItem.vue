<template>
  <form-item
    class="prop-item">

    <template slot="label">
      <span class="prop-label" v-if="!showDropdown" @click="openDropdown">
        {{prop.label}}
        <Icon type="ios-arrow-down"></Icon>
      </span>

      <Dropdown v-if="showDropdown"
                trigger="click"
                @on-visible-change="visibleChange"
                :visible="visible">
        <span class="prop-label">
          {{prop.label}}
          <Icon type="ios-arrow-down"></Icon>
        </span>
        <DropdownMenu slot="list">
          <DropdownItem
            v-for="editor in propEditors"
            @click.native="changeType(editor.id)"
            :selected="editor.id === editorType"
            :key="editor.id">{{editor.name}}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </template>

    <div class="prop-editor">
      <component
        :is="editorType"
        v-model="propData[editorType]"
        @input="changeValue"
        v-bind="getEditorProps()"
      ></component>
      <Tooltip class="prop-help"
               placement="left"
               :transfer="true"
               v-if="helpContent">
        <div class="prop-help-content" slot="content" v-html="helpContent"></div>
        <Icon type="md-help"/>
      </Tooltip>
    </div>
  </form-item>
</template>
<script>

  import _ from 'lodash';

  const components = {};

  function formatToEditor (str) {
    let sp1 = str.split('?');
    let props = {};
    if (sp1[1]) {
      sp1[1].split('&').map(prop => {
        let sp2 = prop.split('=');
        let v = sp2[1];
        if (v === 'true') {
          v = true;
        } else if (v === 'false') {
          v = false;
        } else if (v && v.match(/^\d+$/)) {
          v = parseInt(v);
        }
        props[sp2[0]] = v;
      });
    }
    return {
      type: sp1[0],
      props,
    };
  }

  export default {
    props: {
      prop: Object,
      variables: Object,
    },

    components,

    data () {
      return {
        propEditors: [],
        propData: {},
        editorType: undefined,
        showDropdown: false,
        visible: false,
      };
    },

    computed: {
      curPropEditor () {
        return _.find(this.propEditors, { id: this.editorType });
      },

      helpContent () {
        return this.curPropEditor.help || this.prop.config.help;
      },
    },

    watch: {
      prop: {
        handler () {
          const propData = {};
          const Editors = _.map(Object.values(components), 'propEditorConfig');

          const DefaultEditors = _.map(['variable', 'expression'], type => {
            return _.find(Editors, { type });
          });

          const propEditors = _(this.prop.config.editors || []).castArray()
            .map(opts => {

              let editor = null;
              if (_.isString(opts)) {
                editor = formatToEditor(opts);
              } else {
                editor = formatToEditor(opts.type);
                Object.assign(editor.props, opts.props);
                editor = Object.assign({}, opts, editor);
              }
              const _editor = _.find(Editors, { type: editor.type });
              return Object.assign({}, _editor, editor);

            }).concat(DefaultEditors).map(editor => {
              propData[editor.id] = undefined;
              return editor;
            }).value();

//          if (!_.find(propEditors, { dynamic: false })) {
//            propEditors.push(_.find(Editors, { type: 'text' }));
//          }

          let editorType = this.prop.editorType;
          if (!editorType && !_.isUndefined(this.prop.value)) {
            editorType = (_.find(propEditors, { dynamic: this.prop.dynamic }) || {}).id;

            if (editorType === 'PropVariableEditor') {
              editorType = (this.prop.value.match(/^[\$_a-z][\w\$]*$/i) ? 'PropVariableEditor' : 'PropExpressionEditor');
            }
          }

          if (editorType) {
            propData[editorType] = this.prop.value;
          } else {
            editorType = _.first(propEditors).id;
          }

          if (propData[editorType] === undefined) {
            propData[editorType] = _.find(propEditors, { id: editorType }).default;
          }

          this.propEditors = propEditors;
          this.propData = propData;
          this.editorType = editorType;

        },
        immediate: true,
      },
    },

    methods: {

      getEditorProps () {
        if (this.curPropEditor.props && _.isFunction(this.curPropEditor.props)) {
          return this.curPropEditor.props.call(this);
        }
        return this.curPropEditor.props;
      },

      changeType (type) {
        this.editorType = type;
        if (this.propData[this.editorType]) {
          this.changeValue();
        }
      },

      changeValue: _.debounce(function () {
        this.$emit('on-change', {
          editorType: this.editorType,
          value: this.propData[this.editorType],
          dynamic: this.curPropEditor.dynamic,
          name: this.prop.name,
        });
      }, 100),

      openDropdown () {
        this.showDropdown = true;
        setTimeout(() => this.visible = true, 10);
      },

      visibleChange (visible) {
        if (visible === false) {
          this.showDropdown = false;
          this.visible = false;
        }
      },

    },
  };
</script>
<style lang="less">
  .prop-item {
    margin-bottom: 10px;
  }

  .prop-label {
    cursor: pointer;
    user-select: none;
    font-weight: 600;

    &:hover {
      color: #2d8cf0;
    }
  }

  .prop-help {
    line-height: 32px;
    position: absolute;
    top: 0px;
    right: -16px;

    &:hover {
      cursor: pointer;
      color: #5cadff;
    }
  }

  .prop-help-content {
    line-height: 40px;
    width: 230px;
    white-space: normal;

    & > code {
      background: #f7f7f7 !important;
      color: #666 !important;;
    }
  }
</style>
