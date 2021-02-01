<template>
  <TabPane
    tab="designer-view"
    :name="id"
    :label="title">
    <slot></slot>
  </TabPane>
</template>
<script>
  export default {
    props: {
      id: String,
      title: String,
    },
  };
</script>
