<template>
  <div class="vuc-editor" tabIndex="9999">

    <div class="vuc-editor-content">

      <div class="vuc-ceditor">

        <div class="vuc-ceditor-panle vuc-ceditor-panle-top" v-if="showRuler">
          <div class="vuc-ceditor-empty"/>
          <VucEditorRuler
            :style="{ marginLeft: -scrollLeft + 'px'}"
            :size="200"
            :scale="10"
            direction="row"/>
        </div>

        <div class="vuc-ceditor-panle vuc-ceditor-panle-bottom">
          <VucEditorRuler v-if="showRuler"
                          :style="{ marginTop: -scrollTop + 'px'}"
                          :size="200"
                          :scale="10"
                          direction="column"/>
          <div class="vuc-ceditor-cpanle">
            <div class="app-wrapper" @scroll="scroll"
                 :style="options.wrapperStyle">
              <div class="app"/>
            </div>
          </div>
          <VucEditorNodeSelectedLayer/>
          <VucEditorNodeHoverLayer/>
          <VucEditorNodeTools/>
        </div>

        <VucContextMenu
          class="vuc-editor-menu"
          v-model="menuState"
          :items="contenxtMenuItems"
          :style="contextMenuStyle"
          @click-item="handleMenu"></VucContextMenu>
      </div>


      <template v-if="showStructure">
        <div class="vuc-panle-resize-handler"
             @mousedown.stop.prevent="resizeRight"
             :style="{ right: rightPanleWidth + 'px' }"></div>
        <StructureEditor style="flex-shrink: 0" :style="{width: rightPanleWidth + 'px'}"></StructureEditor>
      </template>

    </div>

    <VucEditorNodeNav/>
  </div>

</template>

<script>

  import _ from 'lodash';
  import Vue from 'vue';

  import eventsMixin from './events';
  import keymapMixin from './keymap';

  import VucEditorRuler from './VucEditorRuler.vue';
  import VucEditorNodeNav from './VucEditorNodeNav.vue';
  import VucEditorNodeSelectedLayer from './VucEditorNodeSelectedLayer.vue';
  import VucEditorNodeHoverLayer from './VucEditorNodeHoverLayer.vue';
  import VucEditorNodeTools from './VucEditorNodeTools.vue';
  import StructureEditor from '../StructureEditor';

  import { generateVucProxy } from './VucProxy';
  import { createMenus } from '../../contextMenus';

  import vucNodeApi from '../../api/vucNodeApi';

  export default Vue.extend({
    components: {
      VucEditorRuler,
      VucEditorNodeNav,
      VucEditorNodeTools,
      VucEditorNodeSelectedLayer,
      VucEditorNodeHoverLayer,
      StructureEditor,
    },

    mixins: [eventsMixin, keymapMixin],

    props: {
      id: String,
      vucAst: Object,
      options: {
        type: Object,
        default() {
          return {};
        },
      },
    },

    data() {
      return {
        scrollLeft: 0,
        scrollTop: 0,
        menuState: false,
        contextMenuStyle: {},
        currentSelections: [],
        hoverVucNode: null,
        rightPanleWidth: 300,
      };
    },

    computed: {
      currentNode() {
        return _.first(this.currentSelections);
      },

      contenxtMenuItems() {
        if (this.menuState && this.currentNode) {
          return createMenus(this.currentNode);
        }
        return [];
      },

      showRuler() {
        return this.options.showRuler || true;
      },

      showStructure() {
        return this.options.showStructure || true;
      },

    },

    mounted() {
      this.openPage();
    },

    watch: {
      vucAst(n, oldVucAst) {
        this.closePage(oldVucAst);
        this.openPage();
      },
    },

    methods: {
      closePage(oldVucAst) {
        if (oldVucAst.vucInstance) {
          oldVucAst.vucInstance.$destroy();
          this.$el.querySelector('.app-wrapper').innerHTML = '<div class="app"/>';
        }
      },

      openPage() {
        let vucAst = this.vucAst;
        vucAst.vucInstance = generateVucProxy({ parent: this }, vucAst);
        this.$vuc = vucAst.vucInstance;
        this.$vuc.$mount(this.$el.querySelector('.app'));
      },

      scroll() {
        this.scrollTop = this.$el.querySelector('.app-wrapper').scrollTop;
        this.scrollLeft = this.$el.querySelector('.app-wrapper').scrollLeft;
      },

      selectVucNode(vucNode, el) {
        this.currentSelections = [vucNode];
        this.currentSelectElement = el;
      },

      clearSelected() {
        this.currentSelections = [];
      },

      showMenu(event) {
        let rect = this.$el.getBoundingClientRect();
        this.menuState = true;
        this.contextMenuStyle = {
          top: ( event.pageY - rect.y ) + 'px',
          left: ( event.pageX - rect.x ) + 'px',
        };
      },

      handleMenu(item) {
        let node = this.currentNode;
        item.handler(node, this);
      },

      getVucNode(astId) {
        return this.vucAst.ASTNodes[astId];
      },

      getVucNodeElement(vucNode) {
        return document.querySelector(`[data-ast-id="${ vucNode._astId }"]`);
      },

      findVucInstancesById(id) {
        let vucInstances = [];

        function find(instances) {
          instances.filter(instance => {
            if (instance.$attrs['data-ast-id'] === id) {
              vucInstances.push(instance);
            }
            if (instance.$children.length) {
              find(instance.$children);
            }
          });
        }

        find(this.$vuc.$children);

        return vucInstances;
      },

      applyApi(apiName) {
        return vucNodeApi[apiName].apply(this, Array.from(arguments).slice(1));
      },

      resizeRight(e) {
        let x = e.pageX;

        let rightPanleWidth = this.rightPanleWidth;

        let move = (e) => {
          let w = rightPanleWidth - ( e.pageX - x );
          if (w > 1000) w = 1000;
          if (w < 200) w = 200;

          this.rightPanleWidth = w;
        };

        let up = (e) => {
          window.removeEventListener('mousemove', move);
          window.removeEventListener('mouseup', up);
        };

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
      },

    },
  });
</script>

<style>
  .app-wrapper {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: auto;
  }
</style>
