<template>
  <Collapse class="vuc-collapse" value="0">
    <Panel>
      <span class="vuc-panel-title">{{title}}</span>
      <div class="vuc-panel-title-extra" @click.stop>
        <Icon v-if="extraIcon" @click="$emit('extra-click')" :type="extraIcon"></Icon>
        <slot name="extra"></slot>
      </div>
      <div class="vuc-collapse-body" slot="content" :style="{ padding }">
        <slot></slot>
      </div>
    </Panel>
  </Collapse>
</template>
<script>
  export default {
    props: {
      title: String,
      extraIcon: String,
      padding: {
        type: String,
        default: '8px 16px',
      },
    },
  };
</script>
