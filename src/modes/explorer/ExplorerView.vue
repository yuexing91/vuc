<template>
  <Collapse class="vuc-collapse" value="0" style="border: none;outline: none;"
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

  import designerMixins from '../designerMixins.js';

  export default {
    mixins: [designerMixins],
    props: {
      components: Array,
    },
    data() {
      return {
        curSelected: null,
      };
    },
    methods: {
      dropStart(e, component) {
        this.activeEditor.dropStart(e, component, {
          x: 0,
          y: 0,
          width: '100px',
          height: '30px',
        });
      },
      select(component) {
        this.curSelected = component;
      },
    },
  };
</script>
