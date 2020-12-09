<template>
  <span class="vue-node cm-s-default"
        @click="selectNode"
        @contextmenu.stop.prevent="showMenu"
        @mousedown.stop="dropStart">

    <template v-if="isTag">
        <span class="cm-tag"
              @mousemove="dropMove"
              @mouseup="dropUp">{{node.tag}}</span>
        <span class="vue-node-attrs" v-if="attrs.length">
          <span
            v-for="(attr,index) in attrs"
            :key="attr.key"
            class="vue-node-attr"
            :style="attr.style">
            <span class="cm-attribute">{{attr.key}}=</span><span class="cm-string">"{{attr.value}}"</span>
          </span>
        </span>
    </template>
    <template v-else>
      <span class="cm-str"  @mousemove="dropMove"
            @mouseup="dropUp">{{node.text}}</span>
    </template>
  </span>
</template>
<script>
  import _ from 'lodash';
  export default{
    props: {
      node: Object
    },
    inject: ['$Structure'],
    computed: {
      isTag(){
        return this.node.tag;
      },
      attrs(){
        let attrs = _.map(this.node.attrsMap, (value, key) => {
          return {
            value,
            key,
          }
        }).filter(attr => {
          const first = attr.key[0] === ':' ? attr.key[1] : attr.key[0];
          return first !== '_' && attr.value !== undefined;
        });

        if (attrs.length > 2) {
          const style = `margin-left:${((this.node.tag.length) * 7.7 + 23)}px`;
          attrs.forEach((attr, index) => {
            if (index) {
              attr.style = style;
            }
          })
        }

        return attrs
      }
    },
    data(){
      return {}
    },
    methods: {
      selectNode(){
        this.$Structure.selectNode(this.node);
      },
      dropStart(e){
        this.$Structure.dropStart(e, this.node);
      },
      dropMove(e){
        this.$Structure.dropMove(e, this.node);
      },
      dropUp(e){
        this.$Structure.dropUp(e, this.node);
      },
      showMenu(e){
        this.$Structure.showContextMenu(e, this.node);
      }
    }
  }
</script>
<style lang="less">
  .vue-node {
    font: 14px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace !important;
    cursor: pointer;
    user-select: none;
    &.vue-node-selected {
      .cm-tag, .vue-node-attr, .cm-str {
        background: #FFFAE3;
      }
    }

    .cm-tag {
      line-height: 20px;
      height: 20px;
      margin-right: -8px;
      padding-right: 16px;
      display: inline-block;
    }

    .vue-node-attr {
      line-height: 20px;
      height: 20px;
      display: block;
      padding-right: 7px;
    }

    .vue-node-attr:first-child, .vue-node-attr:last-child {
      display: inline-block;
    }
  }

</style>
