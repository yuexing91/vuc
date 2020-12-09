<template>
  <VucCollapsePanel title="指令" v-if="!textNode">
    <a slot="extra" @click="editDirective()">
      <icon type="md-add"></icon>
    </a>

    <Modal title="指令" :mask-closable="false" v-model="editState" width="700" @on-ok="saveForm">
      <DirectiveForm :value="curDirective" :directives="directives"></DirectiveForm>
    </Modal>

    <div class="vuc-direct" v-for="item in items" :key="item.schema.name">
      <a class="vuc-direct-tools" @click="delDirective(item.directive)">删除</a>
      <table>
        <tr>
          <th>指令：</th>
          <td><code @click="editDirective(item.directive)" title="点击编辑">{{item.schema.name}}</code></td>
        </tr>
        <tr>
          <th>功能：</th>
          <td>{{item.schema.describe}}</td>
        </tr>
        <tr v-for="prop in item.schema.props" :key="prop.name">
          <th>{{prop.describe}}：</th>
          <td><code>{{item.directive[prop.name]}}</code>
          </td>
        </tr>
      </table>
    </div>
  </VucCollapsePanel>
</template>
<script>
  import DirectiveForm from './DirectiveForm.vue';
  import designerMixins from '../designerMixins.js';
  import { getDirectiveSchema } from './systemDirectives';

  export default {
    components: {
      DirectiveForm,
    },
    data () {
      return {
        editState: false,
        directives: [],
        curDirective: {},
      };
    },
    mixins: [designerMixins],
    watch: {
      currentNode: 'loadDirectives',
    },
    computed: {
      items () {
        return this.directives.map(directive => {
          return {
            schema: getDirectiveSchema(directive.name),
            directive,
          };
        });
      },
    },
    methods: {
      loadDirectives () {
        this.directives = this.currentNode ? this.currentNode.getDirectives() : [];
      },
      editDirective (directive) {
        if (!this.currentNode) return;
        this.curDirective = Object.assign({ name: '' }, directive);
        this.editState = true;
      },
      saveForm () {
        this.currentNode.setDirective(this.curDirective.name, this.curDirective);
        this.loadDirectives();
      },
      delDirective (directive) {
        this.currentNode.delDirective(directive.name);
        this.loadDirectives();
      },
    },
  };
</script>
<style lang="less">

  .vuc-direct {
    position: relative;

    &-tools {
      position: absolute;
      top: 0px;
      right: 10px;
    }

    th {
      text-align: right;
      width: 70px;
    }

  }


</style>
