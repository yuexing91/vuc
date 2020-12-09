<template>
  <Collapse class="vuc-collapse" @keydown.ctrl.native.prevent="copy" value="0" style="border: none;outline: none;"
            tabindex="999">
    <Panel v-for="group in components" :key="group.title">
      <span class="vuc-panel-title">{{group.title}}</span>
      <div slot="content" class="vuc-explorer-group">
          <span v-for="component in group.children"
                :class="{'vuc-selected':component==curSelected}"
                :key="component.id"
                @click.left="select(component)"
                @mousedown="dropStart($event,component)">
            {{component.title}}
          </span>
      </div>
    </Panel>
  </Collapse>
</template>

<script>

  import VucNodeHelper from '@/helpers/VucNodeHelper';
  import designerMixins from '../designerMixins.js';

  export default {
    mixins: [designerMixins],
    data () {
      return {
        curSelected: null,
      };
    },
    computed: {
      components () {
        return this.$designer.options.components;
      },
    },
    methods: {
      dropStart (e, component) {
        let vucNode = component.isText ? VucNodeHelper.createTextNode(component.template) : VucNodeHelper.createVucNode(component.template);
        this.activeEditor.dropStart(e, vucNode, {
          x: 0,
          y: 0,
          width: '100px',
          height: '30px',
        });
      },
      select (component) {
        this.curSelected = component;
      },
      copy (e) {
        if (e.keyCode == '67') {
          let vucNode = VucNodeHelper.createVucNode(this.curSelected.template);
          this.activeEditor.applyApi('copyNode', vucNode);
        }
      },
    },
  };
</script>
