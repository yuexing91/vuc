<template>
  <div class="vuc-cfg-view">
    <VucCollapsePanel
      v-for="group in groups"
      :key="group.title"
      :title="group.title">

      <template slot="extra">
        <i-button
          v-for="(btn,index) in getPanelTools(group)"
          @click="toolClick(btn)"
          type="text"
          :icon="btn.icon"
          :key="index">
        </i-button>
      </template>

      <component v-for="panel in group.panels"
                 ref="panels"
                 :panel="panel"
                 :key="panel"
                 :is="getPanelComponent(panel)"/>
    </VucCollapsePanel>
  </div>
</template>

<script>

  import { getPanel } from './util';

  export default {
    props: {
      groups: Array,
    },
    methods: {
      getPanelComponent(id) {
        return getPanel(id);
      },
      getPanelTools(group) {
        return group.panels.flatMap(panel => {
          let ts = getPanel(panel).panelTools || [];
          return ts.map(btn => Object.assign({ panel }, btn));
        });
      },
      toolClick(btn) {
        let $panel = this.$refs.panels.find(panel => panel.$attrs.panel == btn.panel);
        btn.handler.call($panel);
      },
    },
  };
</script>

<style lang="less">
  .vuc-cfg-view {
    height: 100%;
    overflow: auto
  }
</style>
