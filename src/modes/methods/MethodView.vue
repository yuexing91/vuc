<template>
  <VucCollapsePanel title="methods" extra-icon="md-add" @extra-click="editMethod">

    <vuc-code-list :data="VucMethods" @click-item="editMethod" @delete-item="delMethod"></vuc-code-list>

    <Modal v-model="editState" title="方法编辑" width="700" @on-ok="saveMethod" :mask-closable="false">
      <MethodEditor ref="editor" :method="curMethod"></MethodEditor>
    </Modal>
  </VucCollapsePanel>
</template>

<script>
  import designerMixins from '../designerMixins.js';
  import MethodEditor from './MethodEditor.vue';

  export default {
    mixins: [designerMixins],

    data () {
      return {
        editState: false,
        curMethod: {},
      };
    },

    computed: {
      VucMethods () {
        if (this.vucAst) {
          return this.vucAst.VucMethods;
        }
        return [];
      },
    },

    components: {
      MethodEditor,
    },

    methods: {

      editMethod (method) {
        this.curMethod = Object.assign({
          id: undefined,
          name: '',
          bodyCode: '',
          params: [],
        }, method);
        this.editState = true;
      },

      saveMethod () {
        this.$refs.editor.validate().then(valid => {
          if (valid) {
            this.vucAst.saveMethod(this.curMethod);
          }
        });
      },

      delMethod (method) {
        this.vucAst.delMethod(method);
      },

    },
  };
</script>
