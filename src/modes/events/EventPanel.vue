<template>

  <div class="vuc-mode-view" v-if="!textNode">
    <Modal v-model="editState" title="事件编辑" width="700" :mask-closable="false" @on-ok="saveEvent">
      <EventEditor
        ref="editor"
        :isHTML="isHTML"
        :methods="VucMethods"
        :event="curEvent"
        :eventTypes="eventTypes">
      </EventEditor>
    </Modal>

    <div v-for="event in curVucNodeEvents" :key="event.id" @click="editorEvent(event)">
      <div>
        事件：<code>{{event.id}}</code>
      </div>
      <div>
        代码：<code>{{event.code}}</code>
      </div>
    </div>

  </div>

</template>
<script>

  import _ from 'lodash';

  import { processEvent, isEventAttr } from './eventConfig';

  import EventEditor from './EventEditor.vue';
  import designerMixins from '../designerMixins.js';

  export default {
    components: {
      EventEditor,
    },
    mixins: [designerMixins],
    data() {
      return {
        curEvent: {},
        editState: false,
      };
    },
    computed: {

      VucMethods() {
        if (this.vucAst) {
          return this.vucAst.VucMethods;
        }
        return [];
      },

      isHTML() {
        return this.currentNode && this.currentNode.isHTML();
      },

      curVucNodeEvents() {
        const events = [];
        const vucNode = this.currentNode;
        if (vucNode) {
          _.forEach(vucNode.attrsMap, (v, k) => {
            if (isEventAttr(k)) {
              let event = processEvent(k);
              event.code = v;
              event.key = k;
              events.push(event);
            }
          });
        }

        return events;
      },

      eventTypes() {
        let vucNode = this.currentNode;
        if (vucNode) {
          let config = vucNode.getConfig();
          if (config && config.eventTypes) {
            return config.eventTypes;
          }
        }
        return [];
      },

    },
    methods: {
      editorEvent(event) {
        if (!this.currentNode) return;
        this.curEvent = Object.assign({
          id: '',
          code: '',
          modifiers: [],
          sysModifiers: [],
          keyModifier: undefined,
          mouseModifier: undefined,
        }, event);
        this.editState = true;
      },
      saveEvent() {
        let vucNode = this.currentNode;
        this.$refs.editor.validate().then(r => {
          if (r) {
            let event = this.curEvent;
            let path = [event.id, event.keyModifier, event.mouseModifier].concat(event.modifiers).concat(event.sysModifiers);
            let k = `@` + path.filter(m => m).join('.');

            if (event.key != k) {
              this.$delete(vucNode.attrsMap, event.key);
            }
            this.$set(vucNode.attrsMap, k, event.code);

          }
        });
      },
    },

    panelTools: [{
      icon: 'md-add',
      handler() {
        this.editorEvent();
      },
    }],

  };
</script>
