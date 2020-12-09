import _ from 'lodash';
import DropManager from '../../drop/DropManager';
import DropRect, { getPos } from '@/helpers/DropRect';

const dropManager = new DropManager();

export default {
  data () {
    return {
      dropManager,
    };
  },
  mounted () {
    this.bindEvent();
  },

  destroyed () {
    for (let name in this.__events__) {
      this.__events__[name].forEach(fn => {
        document.body.removeEventListener(name, fn);
      });
    }
  },

  methods: {
    bindEvent () {
      this.bindHoverEvent();
      this.bindSelectEvent();
      this.bindDropmoveEvent();
      this.bindDropupEvent();
      this.bindContextmenuEvent();
    },

    bindHoverEvent () {

      document.body.addEventListener('mouseover', e => {
        let eles = e.composedPath();
        for (let i = 0; i < eles.length; i++) {
          let el = eles[i];
          if (el.dataset && el.dataset.astId) {
            let vucNode = this.getVucNode(el.dataset.astId);
            this.hoverVucNode = vucNode;
            this.hoverVucNodeEl = el;
            return;
          }
        }
        this.hoverVucNode = null;
        this.hoverVucNodeEl = null;
      });

    },

    bindSelectEvent () {
      this.addEvent('click', (event, vucNode, curElement) => {
        this.selectVucNode(vucNode, curElement);
        return true;
      });
    },

    bindContextmenuEvent () {
      this.addEvent('contextmenu', (event, vucNode) => {
        this.selectVucNode(vucNode);
        this.showMenu(event);
        event.preventDefault();
        event.stopPropagation();
        return true;
      });
    },

    bindDropmoveEvent () {

      this.addEvent('mousemove', (event, curVucNode, curElement) => {
        if (!dropManager.isDrop) return;

        let pos = this.getRelativePos(event, dropManager.dropVucNode, curVucNode, curElement);

        if (pos == null) return;

        if (pos.pos === 'inner') {
          let rect = pos.el.getBoundingClientRect();
          dropManager.proxyPosElementStyle = {
            width: rect.width + 'px',
            height: rect.height + 'px',
            top: rect.top + 'px',
            left: rect.left + 'px',
            opacity: 0.2,
          };
        } else {
          dropManager.proxyPosElementStyle = Object.assign({ opacity: 0.7 }, pos.rect.getStyle(pos.pos));
        }
        event._stopMove = true;
        return true;
      });

    },

    bindDropupEvent () {

      this.addEvent('mouseup', (event, curVucNode, curElement) => {
        if (!dropManager.isDrop) return;
        let pos = this.getRelativePos(event, dropManager.dropVucNode, curVucNode, curElement);
        if (pos == null) return;

        if (pos.isNotMove) {
          event._stopUp = true;
          return true;
        }

        let dropNode = dropManager.dropVucNode;

        if (dropNode.attrsMap.slot) {
          dropNode.attrsMap.slot = undefined;
        }

        if (pos.pos === 'inner') {
          this.applyApi('insterToSlot', curVucNode, pos.slot, dropNode);
        } else {
          let targetNode = pos.rect.data;
          let p = pos.pos === 'r' || pos.pos === 'b' ? 'after' : 'before';
          this.applyApi('parseNode', targetNode, p, dropNode);
        }

        event._stopUp = true;
        return true;
      });
    },

    dropStart (event, vucNode, dropProxyInfo) {
      dropManager.dropStart(event, vucNode, dropProxyInfo);
    },

    addEvent (eventName, callback) {
      let wrapEvent = e => {
        let eles = e.composedPath();

        for (let i = 0; i < eles.length; i++) {
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

    getRelativePos (event, dropVucNode, curVucNode, curVucNodeElement) {

      function getInnerPos (slot, el) {
        let rect = createRect(curVucNode, curVucNodeElement);
        let pos = rect.getInsidePos(event.pageX, event.pageY);
        let value = rect.isBlock ? rect.height : rect.width;
        pos.rect = rect;
        if (pos.value < value / 5 && pos.value < 10) {
          return pos;
        }

        return {
          pos: 'inner',
          slot,
          el,
        };
      }

      function getOtherPos (eles) {

        let rects = eles.filter(el => el.dataset.astId !== dropVucNode._astId).map(el => {
          let vucNode = this.getVucNode(el.dataset.astId);
          return createRect(vucNode, el);
        });

        let pos = getPos({
          x: event.pageX,
          y: event.pageY,
        }, rects);

        if (pos) {
          let dropNode = dropVucNode;
          let targetNode = pos.rect.data;

          if (targetNode.attrsMap.slot == dropNode.attrsMap.slot) {
            let posNode;
            if (pos.pos === 'r' || pos.pos === 'b') {
              posNode = targetNode.getAfterNode();
            } else if (pos.pos === 'l' || pos.pos === 't') {
              posNode = targetNode.getBeforeNode();
            }
            if (posNode == dropNode) {
              pos.isNotMove = true;
            }
          }
        }
        return pos;
      };

      if (curVucNode.isHTML()) {

        if (curVucNodeElement.childElementCount === 0) {
          return getInnerPos('default', curVucNodeElement);
        }

        return getOtherPos.call(this, _.map(curVucNodeElement.children));
      }

      let slotConfig = canContain(event, dropVucNode, curVucNode, curVucNodeElement);
      if (slotConfig) {
        let vueInstances = this.findVucInstancesById(curVucNode._astId);
        let vueInstance = _.find(vueInstances, { $el: curVucNodeElement });

        let eles = getSlotEles(vueInstance, slotConfig.slot);

        if (_.isEmpty(eles)) {
          return getInnerPos(slotConfig.slot, slotConfig.el);
        }

        return getOtherPos.call(this, eles);
      }
    },

  },
};

function isBlock ($el) {

  let computedStyle = window.getComputedStyle($el);
  if (computedStyle.display === 'block') {
    return true;
  } else if (computedStyle.display === 'inline-block') {
    let parentComputedStyle = window.getComputedStyle($el.parentElement);
    if (parseInt(computedStyle.width) === parseInt(parentComputedStyle.width) - parseInt(parentComputedStyle.paddingLeft) - parseInt(parentComputedStyle.paddingRight)) {
      return true;
    }
  }
  return false;
}

function canContain (event, dropVucNode, curVucNode, curVucNodeElement) {

  if (!dropVucNode) {
    return false;
  }

  if (dropVucNode.isOffspring(curVucNode)) {
    return false;
  }

  let config = curVucNode.getConfig();

  if (config && config.slots) {
    let _slot = null;
    _.find(config.slots, slot => {
      let el;
      if (slot.selector) {
        let _el = curVucNodeElement.querySelector(slot.selector);
        if (event.path.indexOf(_el) != -1) {
          el = _el;
        }
      } else {
        el = curVucNodeElement;
      }

      if (el) {
        _slot = Object.assign({ el }, slot);
        return true;
      }
    });

    return _slot;
  }

  return false;
}

function getSlotEles (vue, slot) {

  if (vue) {
    return _.filter(vue.$slots[slot], vnode => {
      return vnode.elm && vnode.elm.dataset && vnode.elm.dataset.astId;
    }).map(vnode => {
      return vnode.elm;
    });
  }
}

function createRect (instance, el) {
  return new DropRect(el.getBoundingClientRect(), instance, isBlock(el));
}
