<template>
  <div class="vuc-designer vuc-flex-column">
    <div class="vuc-panles vuc-flex-mainitem vuc-flex">
      <DesignerViews :style="leftViewStyle">
        <slot name="left"></slot>
      </DesignerViews>

      <VucEditor ref="editor"
                 style="width: 100px;"
                 :vucAst="vucAst"
                 :options="editorOptions"
                 class="vuc-flex-mainitem"></VucEditor>

      <DesignerViews :style="rightViewStyle">
        <slot name="right"></slot>
      </DesignerViews>
    </div>

    <div class="vuc-panle-resize-handler"
         @mousedown.stop.prevent="resizeRight"
         :style="{ right: rightViewWidth + 'px' }"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  import DesignerViews from './DesignerViews';
  import VucEditor from '../editor';
  import { createVucAst } from '../../runtime';

  const Designer = Vue.extend({
    name: 'VucDesigner',

    components: {
      DesignerViews,
      VucEditor,
    },

    provide() {
      return {
        $designer: this,
      };
    },

    computed: {
      leftViewStyle() {
        return {
          width: '250px',
          borderRightWidth: '1px',
        };
      },
      rightViewStyle() {
        return {
          width: this.rightViewWidth + 'px',
          borderLeftWidth: '1px',
        };
      },
    },

    props: {
      editorOptions: Object,
      content: String,
    },

    data() {
      return {
        vucAst: createVucAst(this.content),
        rightViewWidth: 300,
      };
    },

    methods: {

      addView(views) {
        views.forEach(v => {
          const _v = this.views.find(_v => _v.id === v.id);
          if (_v) {
            Object.assign(_v, v);
          } else {
            this.views.push(v);
          }
        });
      },

      resizeRight(e) {
        const x = e.pageX;

        const rightViewWidth = this.rightViewWidth;

        const move = (e) => {
          let w = rightViewWidth - ( e.pageX - x );
          if (w > 1000) w = 1000;
          if (w < 200) w = 200;

          this.rightViewWidth = w;
        };

        const up = (e) => {
          window.removeEventListener('mousemove', move);
          window.removeEventListener('mouseup', up);
        };

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
      },

      getVueContent() {
        return this.vucAst.getContent();
      },

      setVueContent(content) {
        this.vucAst = createVucAst(content);
      },
    },
  });

  export default Designer;
</script>

