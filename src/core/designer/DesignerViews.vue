<template>
  <div class="vucd-panle">
    <Tabs class="vuc-flex-column"
          v-model="curViewId"
          name="designer-view"
          size="small"
          :animated="false">
      <slot></slot>
    </Tabs>
  </div>
</template>
<script>

  export default {
    props: {
      views: Array,
      type: String,
      value: String,
    },

    data() {
      return {
        curViewId: '',
      };
    },
  };
</script>
<style lang="less">

  .vucd-panle {
    border: 0px solid #dcdee2;

    > .ivu-tabs {
      height: 100%;

      > .ivu-tabs-content {
        flex: 1;
        overflow: hidden;

        > .ivu-tabs-tabpane {
          height: 100%;
          overflow: auto;
        }
      }

      > .ivu-tabs-bar {
        margin-bottom: 0px;
      }
    }

    .ivu-tabs-tab {
      font-size: 14px;
    }

  }


</style>
