<template>
  <div class="vuc-designer vuc-flex-column">
    <div class="vuc-panles vuc-flex-mainitem vuc-flex">
      <DesignerPanle style="width: 250px;border-right-width: 1px"
                     :plugins="leftPlugins"/>

      <VucEditor ref="editor" :vucAst="vucAst" style="width: 100px;"
                 class="vuc-flex-mainitem"></VucEditor>

      <DesignerPanle
        :style="{ width: rightPanleWidth + 'px' }"
        style="border-left-width: 1px"
        :plugins="rightPlugins"/>
    </div>

    <div class="vuc-panle-resize-handler"
         @mousedown.stop.prevent="resizeRight"
         :style="{ right: rightPanleWidth + 'px' }"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  import DesignerPanle from './DesignerPanle';
  import VucEditor from '../editor';
  import { createVucAst } from '../../runtime';

  const VIEWS = [
    {
      id: 'explorer',
      type: 'ExplorerView',
      pos: 'left',
      title: '组件',
    },
    {
      id: 'pagePropertysView',
      type: 'PropertysView',
      pos: 'right',
      title: '页面属性',
      props: {
        configurators: ['DataView', 'ComputedView', 'WatchView', 'MethodView'],
      },
    },
    {
      id: 'childPropertysView',
      type: 'PropertysView',
      pos: 'right',
      title: '组件属性',
      props: {
        configurators: ['TextView', 'PropsView', 'EventView', 'StyleView', 'DirectiveView'],
      },
    },
  ];

  const Designer = Vue.extend({
    name: 'Designer',

    components: {
      DesignerPanle,
      VucEditor,
    },

    provide() {
      return {
        $designer: this,
      };
    },

    props: {
      options: Object,
      content: String,
    },

    data() {
      return {
        vucAst: createVucAst(this.content),
        views: ( this.options.views || VIEWS ).concat([]),
        rightPanleWidth: 300,
      };
    },

    computed: {
      rightPlugins() {
        return this.views.filter(v => v.pos === 'right');
      },

      leftPlugins() {
        return this.views.filter(v => v.pos === 'left');
      },

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

        const rightPanleWidth = this.rightPanleWidth;

        const move = (e) => {
          let w = rightPanleWidth - ( e.pageX - x );
          if (w > 1000) w = 1000;
          if (w < 200) w = 200;

          this.rightPanleWidth = w;
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

      setVueContent(content){
        this.vucAst = createVucAst(content);
      }
    },
  });

  export default Designer;
</script>

