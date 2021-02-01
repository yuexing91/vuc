<template>
  <div>
    <vuc-code-list :data="VucDatas"
                   @click-item="editData"
                   @delete-item="delData"/>

    <Modal title="编辑" v-model="editState" width="800" @on-ok="saveData" :mask-closable="false">
      <DataForm :vucAst="vucAst" :vucData="curData"></DataForm>
    </Modal>
  </div>
</template>

<script>

  import designerMixins from '../designerMixins.js';
  import DataForm from './DataForm.vue';

  export default {
    components: {
      DataForm,
    },

    mixins: [designerMixins],

    data() {
      return {
        curData: null,
        editState: false,
      };
    },

    computed: {
      VucDatas() {
        if (this.vucAst) {
          return this.vucAst.VucDatas;
        }
        return [];
      },
    },

    methods: {
      editData(data) {
        this.curData = Object.assign(
          {
            id: undefined,
            name: undefined,
            code: undefined,
          }, data);

        this.editState = true;
      },

      saveData() {
        if (!this.curData.id) return;
        this.vucAst.saveData(this.curData);
      },

      delData(data) {
        this.vucAst.delData(data);
      },

    },

    panelTools: [
      {
        icon: 'md-add',
        handler() {
          this.editData();
        },
      },
    ],

  };

</script>
