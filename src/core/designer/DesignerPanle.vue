<template>
  <div class="vucd-panle">
    <Tabs class="vuc-flex-column" v-model="curPluginId"
          @on-tab-remove="$emit('on-close-plugin',$event)" :name="name" :type="type" closable
          size="small"
          :animated="false">
      <TabPane
        v-for="plugin in plugins"
        :key="plugin.id"
        :name="plugin.id"
        :tab="name"
        :label="plugin.title">
        <component :is="plugin.type" ref="plugins" v-bind="plugin.props"/>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  export default {
    props: {
      plugins: Array,
      type: String,
      value: String,
    },

    components: {},

    data () {
      return {
        name: 'designer-panle',
        curPluginId: this.value,
      };
    },

    watch: {
      value () {
        this.curPluginId = this.value;
      },

      curPluginId () {
        this.$emit('input', this.curPluginId);
      },
    },

    methods: {
      getPluginInstance (id) {
        return new Promise((r1, r2) => {
          this.$nextTick(() => {
            const plugin = _.find(this.$refs.plugins, plugin => {
              return plugin.id === id;
            });
            r1(plugin);
          });
        });
      },
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
