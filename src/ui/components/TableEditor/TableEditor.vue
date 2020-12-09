<template>
  <div>

    <div style="margin: 2px 6px;position: relative;height: 24px;">
      <div style="position: absolute;right: 2px;top:0px;">
        <template v-if="editIndex === -1">
          <i-button size="small" type="primary" @click="doAdd">新增</i-button>
        </template>
        <template v-else>
          <i-button size="small" type="error" @click="doSave">保存</i-button>
          <i-button size="small" @click="doCancel">取消</i-button>
        </template>
      </div>
    </div>

    <i-table v-bind="tableProps" highlight-row @on-row-dblclick="dbClickRow">
      <template v-for="column in columns" #[column.slot]="{ row, index }">
        <component
          v-if="editIndex == index && column.editor"
          :is="getEditor(column)"
          v-bind="getEditorProps(column)"
          v-model="editData[column.slot]">
        </component>
        <span v-else>{{ row[column.slot] | formatter(column) }}</span>
      </template>
    </i-table>
  </div>
</template>
<script type="text/jsx">

  import _ from 'lodash';
  import iview from 'view-design';

  export default {
    props: {
      ...iview.Table.props,
    },
    computed: {
      tableProps() {
        return _.pick(this, Object.keys(iview.Table.props));
      },
    },
    filters: {
      formatter(value, column) {
        if (column.formatter) {
          return column.formatter[value];
        }

        if (column.editor && column.editor.type === 'select') {
          let item = _.find(column.editor.props.items, { value });
          if (item) {
            return item.label;
          }
        }

        return value;
      },
    },
    data() {
      return {
        editIndex: -1,
        editData: {},
        editors: {
          input: {
            tag: 'i-input',
            props: {
              size: 'small',
            },
          },
          select: {
            tag: 'vuc-select',
            props: {
              size: 'small',
            },
          },
        },
      };
    },
    methods: {

      getEditorConfig(column) {
        let editor = _.isString(column.editor) ? column.editor : column.editor.type;
        return this.editors[editor];
      },

      getEditor(column) {
        let config = this.getEditorConfig(column);
        if (config) {
          return config.tag;
        }
        return _.isString(column.editor) ? column.editor : column.editor.type;
      },

      getEditorProps(column) {
        let config = this.getEditorConfig(column);
        return Object.assign({}, config.props, column.editor.props);
      },

      doAdd() {
        this.$emit('on-add');
        this.doEdit(this.data.length - 1);
        this._isAdd = true;
      },

      dbClickRow(row, index) {
        if (index != this.editIndex) {
          this.doEdit(index);
        }
      },

      doEdit(index) {
        this.doCancel();
        let row = this.data[index];
        this.editData = Object.assign({}, row);
        this.editIndex = index;
        this.$emit('on-edit', row, index);
      },

      doSave() {
        Object.assign(this.data[this.editIndex], this.editData);
        this.$emit('on-save', this.data[this.editIndex]);
        this.editFinish();
      },

      doCancel() {
        if (this.editIndex == -1) return;
        if (this._isAdd) {
          this.data.splice(this.data.length - 1, 1);
        }
        this.editFinish();
      },

      editFinish() {
        this.editData = null;
        this.editIndex = -1;
        this._isAdd = false;
      },

    },
  };

</script>
