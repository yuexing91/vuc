<template>
  <div class="vuc-mode-view">
    <div class="vuc-style-inline">
      <div @click="addItem(-1)">内联样式 {</div>
      <StyleItem v-for="(style,index) in styles"
                 :item="style"
                 :editType="getEditType(style) "
                 @editover="editover"
                 @enter-value="editNext"
                 @click.native="addItem(index)"
                 :key="index"/>
      <div>}</div>
    </div>
  </div>
</template>

<script>

  import _ from 'lodash';
  import StyleItem from './StyleItem';
  import designerMixins from '../designerMixins.js';

  export default {
    components: { StyleItem },
    mixins: [designerMixins],
    data() {
      return {
        curEvent: {},
        editState: false,
        styles: [],
        currentItem: undefined,
      };
    },
    computed: {
      styleStr() {
        return this.currentNode ? ( this.currentNode.attrsMap.style || '' ) : '';
      },
    },
    watch: {
      styleStr: {
        handler(styleStr) {
          let styles = [];

          if (styleStr) {
            let comments = {};
            let i = 0;
            let innerStyle = styleStr.replace(/\/\*+(.*)?\*+\//g, function (match, g1) {
              let key = '$' + i++;
              comments[key] = g1;
              return key;
            });

            function parse(str, comment) {
              str.split(';').forEach(s => {
                s = s.trim();
                if (!s) return;

                if (comment && comments[s]) {
                  return parse(comments[s], false);
                }

                styles.push({
                  k: s.split(':')[0],
                  v: s.split(':')[1],
                  comment,
                });
              });
            }

            parse(innerStyle, true);
          }

          this.styles = styles;
        },
        immediate: true,
      },
    },
    methods: {
      editover(item) {
        if (this.currentNode) {
          if (item.k.trim().length === 0) {
            let index = this.styles.indexOf(item);
            if (index > -1) {
              this.styles.splice(index, 1);
            }
          }

          let style = this.styles.map(style => {
            let s = style.k + ':' + style.v + ';';
            if (!style.comment) {
              return `/* ${ s } */`;
            }
            return s;
          }).join('');

          this.currentNode.setStyle(style);
        }
        this.currentItem = undefined;
      },

      editNext(item) {
        this.$nextTick(() => {
          if (item === _.last(this.styles)) {
            this.addItem();
          } else {
            this.currentItem = this.styles.indexOf(item) + 1;
          }
        });
      },

      addItem(index) {
        if (!this.currentNode) return;
        this.currentItem = {
          k: ' ',
          v: ' ',
          comment: true,
        };

        if (index === undefined) {
          this.styles.push(this.currentItem);
        } else {
          this.styles.splice(index + 1, 0, this.currentItem);
        }
      },

      getEditType(style) {
        return this.currentItem === style ? 'key' : undefined;
      },
    },

    panelTools: [
      {
        icon: 'md-add',
        handler() {
          this.addItem();
        },
      },
    ],

  };
</script>
