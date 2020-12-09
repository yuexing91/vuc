export default {
  inject: ['$designer'],
  computed: {
    activeEditor () {
      return this.$designer.$refs.editor;
    },
    vucAst () {
      return this.$designer.vucAst;
    },
    vucInstance () {
      return this.vucAst.vucInstance;
    },
    currentNode () {
      return this.activeEditor.currentNode;
    },
    textNode () {
      return this.currentNode && this.currentNode.isText();
    },
  },
};
