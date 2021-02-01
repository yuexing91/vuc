import _ from 'lodash';
import DropManager from '../../drop/DropManager';
import { someHandlerIsFalse } from '@/helpers/lang';

import { getEditorHook } from './config';

const dropManager = new DropManager();

function getNodeHook(node, hook) {
  let option = node.getConfig('vucEditorOption');
  if (option && _.has(option, hook)) {
    return option[hook];
  }
}

export default {

  data() {
    return {
      dropManager,
    };
  },

  mounted() {
    this.bindEvent();
  },

  destroyed() {
    for(let name in this.__events__) {
      this.__events__[name].forEach(fn => {
        document.body.removeEventListener(name, fn);
      });
    }
  },

  methods: {

    bindEvent() {
      this.bindHoverEvent();
      this.bindSelectEvent();
      this.bindDropmoveEvent();
      this.bindDropupEvent();
      this.bindContextmenuEvent();
    },

    getHookHandlers(name) {
      let fns = [];
      if (this.options[name]) {
        fns.push(this.options[name]);
      }

      return fns.concat(getEditorHook(name));
    },

    handlerHook(hook, otherHandler, ...args) {
      let handlers = this.getHookHandlers(hook);
      if (!_.isUndefined(otherHandler)) {
        handlers.push(otherHandler);
      }
      return someHandlerIsFalse(handlers, ...args);
    },

    bindHoverEvent() {
      document.body.addEventListener('mouseover', e => {
        let eles = e.composedPath();
        for(let i = 0; i < eles.length; i++) {
          let el = eles[i];
          if (el.dataset && el.dataset.astId) {
            let vucNode = this.getVucNode(el.dataset.astId);

            if (this.handlerHook('onBeforeSelectNode', getNodeHook(vucNode, 'onBeforeSelectNode'), vucNode)) {
              return;
            }

            this.hoverVucNode = vucNode;
            this.hoverVucNodeEl = el;
            return;
          }
        }
        this.hoverVucNode = null;
        this.hoverVucNodeEl = null;
      });
    },

    bindSelectEvent() {
      this.addEvent('click', (event, vucNode, curElement) => {
        if (this.handlerHook('onBeforeSelectNode', getNodeHook(vucNode, 'onBeforeSelectNode'), vucNode)) {
          return;
        }
        this.selectVucNode(vucNode, curElement);
        return true;
      });
    },

    bindContextmenuEvent() {
      this.addEvent('contextmenu', (event, vucNode) => {
        if (this.handlerHook('onBeforeSelectNode', getNodeHook(vucNode, 'onBeforeSelectNode'), vucNode)) {
          return;
        }
        this.selectVucNode(vucNode);
        this.showMenu(event);
        event.preventDefault();
        event.stopPropagation();
        return true;
      });
    },

    bindDropmoveEvent() {

      this.addEvent('mousemove', (event, curVucNode, curElement) => {
        if (!dropManager.isDrop) return;

        let posInfo = dropManager.getRelativePosInfo(event, { node: curVucNode, el: curElement }, this);

        if (posInfo == null) return;

        if (this.handlerHook('onDragover', undefined, dropManager.dropData, posInfo.targetNode, posInfo.pos)) {
          return;
        }

        if (posInfo.pos === 'inner') {
          let rect = posInfo.el.getBoundingClientRect();
          dropManager.proxyPosElementStyle = {
            width: rect.width + 'px',
            height: rect.height + 'px',
            top: rect.top + 'px',
            left: rect.left + 'px',
            opacity: 0.2,
          };
        } else {
          dropManager.proxyPosElementStyle = Object.assign({ opacity: 0.7 }, posInfo.rect.getStyle(posInfo.pos));
        }
        event._stopMove = true;
        return true;
      });

    },

    bindDropupEvent() {

      this.addEvent('mouseup', (event, curVucNode, curElement) => {
        if (!dropManager.isDrop) return;
        let posInfo = dropManager.getRelativePosInfo(event, { node: curVucNode, el: curElement }, this);
        if (posInfo == null) return;

        if (this.handlerHook('onDragover', undefined, dropManager.dropData, posInfo.targetNode, posInfo.pos)) {
          return;
        }

        event._stopUp = true;

        if (posInfo.isNotMove) return true;

        dropManager.getDropVucNode().then(dropVucNode => {
          if (dropVucNode.attrsMap.slot) {
            dropVucNode.attrsMap.slot = undefined;
          }
          if (posInfo.pos === 'inner') {
            this.applyApi('insterToSlot', curVucNode, posInfo.slot, dropVucNode);
          } else {
            let targetNode = posInfo.rect.data;
            let p = posInfo.pos === 'r' || posInfo.pos === 'b' ? 'after' : 'before';
            this.applyApi('parseNode', targetNode, p, dropVucNode);
          }
        });

        return true;
      });
    },

    dropStart(event, dropData, dropProxyInfo) {
      dropManager.dropStart(event, dropData, dropProxyInfo);
    },

    addEvent(eventName, callback) {
      let wrapEvent = e => {
        let eles = e.composedPath();

        for(let i = 0; i < eles.length; i++) {
          let el = eles[i];
          if (el.dataset && el.dataset.astId) {
            let vucNode = this.getVucNode(el.dataset.astId);
            if (callback(e, vucNode, el)) {
              return;
            }
          }
        }
      };

      document.body.addEventListener(eventName, wrapEvent);

      this.__events__ = this.__events__ || {};
      let events = this.__events__[eventName] = this.__events__[eventName] || [];
      events.push(wrapEvent);
    },
  },
};
