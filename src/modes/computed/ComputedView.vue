<template>
  <VucCollapsePanel title="computed" extra-icon="md-add" @extra-click="editData">

    <vuc-code-list :data="VucComputeds" @click-item="editData" @delete-item="delData"></vuc-code-list>

    <Modal title="编辑" v-model="editState" width="800" @on-ok="save" :mask-closable="false">
      <ComputedForm :vucAst="vucAst" :vucData="curData"></ComputedForm>
    </Modal>
  </VucCollapsePanel>
</template>

<script>

  import designerMixins from '../designerMixins.js';
  import ComputedForm from './ComputedForm.vue';

  export default {
    components: {
      ComputedForm,
    },

    mixins: [designerMixins],

    data () {
      return {
        curData: null,
        editState: false,
      };
    },

    computed: {
      VucComputeds () {
        if (this.vucAst) {
          return this.vucAst.VucComputeds;
        }
        return [];
      },
    },

    methods: {
      editData (data) {
        this.curData = Object.assign(
          {
            id: undefined,
            name: undefined,
            code: undefined,
          }, data);
        this.editState = true;
      },

      save () {
        this.vucAst.saveComputed(this.curData);
      },

      delData (data) {
        this.vucAst.delComputed(data);
      },
    },
  };

</script>
