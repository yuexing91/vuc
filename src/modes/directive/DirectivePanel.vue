<template>
  <div class="vuc-mode-view" v-if="!textNode">
    <DirectiveForm v-for="directive in directives"
                   :directive="directive"
                   :currentNode="currentNode"
                   :key="directive.name">
    </DirectiveForm>
  </div>
</template>

<script>
  import DirectiveForm from './DirectiveForm.vue';
  import designerMixins from '../designerMixins.js';
  import { directiveSchemas } from './systemDirectives';

  export default {
    components: {
      DirectiveForm,
    },
    data() {
      return {
        directives: [],
      };
    },
    mixins: [designerMixins],
    watch: {
      currentNode: {
        handler: 'loadDirectives',
        immediate: true,
      },
    },
    methods: {
      loadDirectives() {
        if (!this.currentNode) {
          return this.directives = [];
        }

        let directives = this.currentNode.getDirectives();
        this.directives = directiveSchemas.map(schema => {
          let directive = directives.find(directive => directive.name == schema.name);
          return Object.assign({
            enable: directive != null,
            data: directive || {},
          }, schema);
        });
      },
    },
  };
</script>

<style lang="less">

</style>
