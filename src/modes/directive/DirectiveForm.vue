<template>
  <Form ref="form" :label-width="70" :model="editData" :show-message="false">
    <div class="vuc-direct">

      <div class="vuc-direct-header">
          <span class="vuc-direct-title" :title="directive.describe">
            v-{{ directive.name }}
          </span>
        <span class="vuc-direct-extra">
            <i-switch v-model="directive.enable" size="small" @on-change="changeEnable(directive)"></i-switch>
          </span>
      </div>

      <div class="vuc-direct-body" v-if="directive.enable">
        <FormItem v-for="prop in directive.props"
                  :prop="prop.name"
                  :required="prop.required"
                  :label="prop.describe"
                  :key="prop.name">
          <VucCodeEditor v-if="editState" v-model="editData[prop.name]" inline sm/>
          <code v-else @click="setEditState(true)">{{directive.data[prop.name]}}</code>
        </FormItem>

        <div v-if="editState" style="text-align: center;margin:6px;">
          <i-button @click="saveForm" size="small" type="primary">确定</i-button>
          <i-button @click="setEditState(false)" size="small">取消</i-button>
        </div>

      </div>
    </div>
  </Form>
</template>

<script>

  export default {
    props: {
      directive: Object,
      currentNode: Object,
    },
    data() {
      return {
        editState: false,
        editData: null,
      };
    },

    watch: {
      editState(editState) {
        if (editState) {
          let name = this.directive.name;
          this.editData = Object.assign({
            name,
            rawName: 'v-' + name,
          }, this.directive.data);
        }
      },
    },

    methods: {

      setEditState(state) {
        this.editState = state;
        if (!state) {
          this.validate().then(success => {
            if (!success) {
              this.directive.enable = false;
              this.changeEnable();
            }
          });
        }
      },

      changeEnable() {
        if (this.directive.enable) {
          this.editState = true;
          this.$nextTick(() => {
            this.validate().then(success => {
              if (success) {
                this.currentNode.setDirective(this.editData);
              }
            });
          });
        } else {
          this.editState = false;
          this.currentNode.delDirective(this.directive.name);
        }
      },

      saveForm() {
        this.validate().then(success => {
          if (success) {
            this.editState = false;
            this.directive.data = this.editData;
            this.currentNode.setDirective(this.editData);
            this.$emit('on-change');
          }
        });
      },

      validate() {
        return this.$refs.form.validate();
      },

    },
  };
</script>

<style lang="less">
  .vuc-direct {
    position: relative;
    margin-bottom: 6px;

    &-header {
      padding: 2px;
      position: relative;
    }

    &-title {
      font-size: 16px;
      color: #fa795e;
    }

    &-extra {
      position: absolute;
      right: 0px;
    }

    &-body {
      padding: 2px 12px 0px;
    }

    .ivu-form-item {
      margin-bottom: 6px;

      .ivu-form-item-content {
        line-height: 26px;
      }

      .ivu-form-item-label {
        padding: 6px 12px 6px 0;
      }
    }
  }
</style>
