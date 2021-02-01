import _ from 'lodash';
import DropRect from '@/helpers/DropRect';
import VucNode from '@/runtime/syntax/VucNode';
import VucNodeHelper from '@/helpers/VucNodeHelper';
import { getVucConfig } from '../../../config';

//拖拽时禁止选中
function noSelection(e) {
  e.preventDefault();
}

export class DropManager {
  constructor() {
    this.isDrop = false;
  }

  //开始拖拽
  dropStart(event, dropData, dropProxyInfo) {
    if (event._stopStartDrop) return;
    this.dropEvent = event;
    this.dropData = Object.assign({}, dropData);
    this.dropProxyInfo = dropProxyInfo;
    event._stopStartDrop = true;

    let move = (e) => {
      return this.showProxy.call(this, e);
    };

    let up = (e) => {
      window.removeEventListener('selectstart', noSelection);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      return this.removeProxy.call(this, e);
    };

    window.addEventListener('selectstart', noSelection);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);

    let node = this.dropData.node;
    if (_.isString(node)) {
      this.dropData.node = node.startsWith('<') ? VucNodeHelper.createVucNode(node) : VucNodeHelper.createTextNode(node);
    }

  }

  showProxy(curEvent) {
    let dropEvent = this.dropEvent;

    if (!dropEvent.first) {
      if (curEvent.timeStamp - dropEvent.timeStamp < 500 && Math.abs(curEvent.pageX - dropEvent.pageX) < 10 && Math.abs(curEvent.pageY - dropEvent.pageY) < 10) {
        return;
      } else {
        dropEvent.first = true;
      }
    }

    if (this.isDrop === false) {
      this.isDrop = true;
      document.body.classList.add('vuc-draging');
    }

    if (this.proxyElement == null) {
      this.proxyElement = document.createElement('div');
      this.proxyElement.className = 'vuc-drag-proxy';
      document.body.appendChild(this.proxyElement);
    }

    if (this.proxyPosElement == null) {
      this.proxyPosElement = document.createElement('div');
      this.proxyPosElement.className = 'vuc-pos-proxy';
      document.body.appendChild(this.proxyPosElement);
    }

    if (curEvent._stopMove) {
      Object.assign(this.proxyPosElement.style, this.proxyPosElementStyle, { display: 'block' });
    } else {
      Object.assign(this.proxyPosElement.style, { display: 'none' });
    }

    Object.assign(this.proxyElement.style, {
      left: curEvent.clientX - this.dropProxyInfo.x + 'px',
      top: curEvent.clientY - this.dropProxyInfo.y + 'px',
      width: this.dropProxyInfo.width,
      height: this.dropProxyInfo.height,
    });
  }

  removeProxy(e) {
    document.body.classList.remove('vuc-draging');
    this.isDrop = false;
    this.dropData = null;
    this.dropProxyInfo = null;
    this.dropEvent = null;
    if (this.proxyElement) {
      document.body.removeChild(this.proxyElement);
      this.proxyElement = null;
    }
    if (this.proxyPosElement) {
      document.body.removeChild(this.proxyPosElement);
      this.proxyPosElement = null;
    }
  }

  isOffspring(curVucNode) {
    return this.dropIsVucNode() && this.dropData.node.isOffspring(curVucNode);
  }

  getSlotInfo(event, cur) {
    let curVucNode = cur.node, curVucNodeElement = cur.el;

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

  getRelativePosInfo(event, cur, editor) {

    if (this.isOffspring(cur.node)) {
      return;
    }

    let dropNode = null;
    let dropAstId;

    if (this.dropIsVucNode()) {
      dropNode = this.dropData.node;
      dropAstId = dropNode._astId;
    }

    function getInnerPos(slot, el) {
      let rect = createRect(cur.node, cur.el);
      let pos = rect.getInsidePos(event.pageX, event.pageY);
      let value = rect.isBlock ? rect.height : rect.width;
      pos.rect = rect;
      if (pos.value < value / 5 && pos.value < 10) {
        return pos;
      }

      return {
        pos: 'inner',
        rect,
        slot,
        el,
      };
    }

    function getOtherPos(slot, eles) {
      let rects = eles.filter(el => el.dataset.astId !== dropAstId).map(el => {
        let vucNode = editor.getVucNode(el.dataset.astId);
        return createRect(vucNode, el);
      });

      let pos = computedPos({
        x: event.pageX,
        y: event.pageY,
      }, rects);

      if (pos) {
        pos.slot = slot;
      }

      return pos;
    };

    let pos;

    // 放置到HTML对象上
    if (cur.node.isHTML()) {
      if (cur.el.childElementCount === 0) {
        pos = getInnerPos('default', cur.el);
      } else {
        pos = getOtherPos('default', _.map(cur.el.children));
        this.markNotMove(pos);
      }
    }
    //放置到组件上
    else {
      let slotConfig = this.getSlotInfo(event, cur);
      if (!slotConfig) return;

      let vueInstances = editor.findVucInstancesById(cur.node._astId);
      let vueInstance = _.find(vueInstances, { $el: cur.el });

      let eles = getSlotEles(vueInstance, slotConfig.slot);

      if (_.isEmpty(eles)) {
        pos = getInnerPos(slotConfig.slot, slotConfig.el);
      } else {
        pos = getOtherPos(slotConfig.slot, eles);
        if (!pos) return;

        //计算和父容器重合的情况下，距离谁更近
        let parentPos = computedPos({
          x: event.pageX,
          y: event.pageY,
        }, [createRect(cur.node, cur.el)]);

        if (parentPos && parentPos.value < 10 && parentPos.value < pos.value) {
          pos = parentPos;
        }

        this.markNotMove(pos);
      }
    }

    let targetNode = pos.rect.data;

    let parentNode = pos.pos == 'inner' ? targetNode : targetNode.getParentNode();

    pos.targetNode = targetNode;
    pos.parentNode = parentNode;

    if (this.dropLimit(this.dropData, pos)) {
      return pos;
    }

  }

  getDropVucNode() {

    let node = this.dropData.node;

    return new Promise(resolve => {
      if (_.isFunction(node)) {
        let result = node.call(null, exec);
        if (!result) return;
        if (result instanceof Promise) {
          result.then(rs => {
            exec(rs);
          });
        } else {
          exec(result);
        }
      } else {
        exec(node);
      }

      function exec(data) {
        if (data instanceof VucNode) {
          resolve(data);
        } else if (_.isString(data)) {
          let vucNode = data.startsWith('<') ? VucNodeHelper.createVucNode(data) : VucNodeHelper.createTextNode(data);
          resolve(vucNode);
        }
      }

    });
  }

  dropLimit(dropData, posInfo) {
    let { parentNode, targetNode, pos } = posInfo;

    let onDragover = parentNode.getConfig('onDragover');
    if (onDragover && onDragover(dropData, targetNode, pos) === false) {
      return false;
    }

    let dropConfig = this.getDropConfig();
    if (dropConfig && dropConfig.onDrop && dropConfig.onDrop(dropData, targetNode, pos) === false) {
      return false;
    }

    return true;
  }

  dropIsVucNode() {
    return this.dropData && this.dropData.node instanceof VucNode;
  }

  markNotMove(pos) {
    if (!this.dropIsVucNode() || !pos) return;
    let targetNode = pos.rect.data;
    let dropNode = this.dropData.node;

    if (targetNode.attrsMap.slot == dropNode.attrsMap.slot) {
      let posNode;
      if (pos.pos === 'r' || pos.pos === 'b') {
        posNode = targetNode.getAfterNode();
      } else if (pos.pos === 'l' || pos.pos === 't') {
        posNode = targetNode.getBeforeNode();
      }
      if (dropNode && posNode === dropNode) {
        pos.isNotMove = true;
      }
    }
  }

  getDropConfig() {
    if (this.dropData.node.getConfig) {
      return this.dropData.node.getConfig();
    }
    return getVucConfig(this.dropData.tag);
  }
}


function getSlotEles(vue, slot) {

  if (vue) {
    return _.filter(vue.$slots[slot], vnode => {
      return vnode.elm && vnode.elm.dataset && vnode.elm.dataset.astId;
    }).map(vnode => {
      return vnode.elm;
    });
  }
}

function createRect(node, el) {
  return new DropRect(el.getBoundingClientRect(), node, el);
}

function computedPos(point, rects, distance = 20) {

  let rect = _.find(rects, rect => {
    return rect.isInside(point.x, point.y);
  });

  if (rect) {
    return rect.getInsidePos(point.x, point.y);
  }

  let pos = _.chain(rects).map(rect => rect.getPosDis(point.x, point.y)).filter(o => o.value >= 0).minBy('value').value();

  if (pos) return pos;

  // 处理空白区域情况
  rect = _.find(rects, rect => rect.y1 >= point.y);
  if (rect) {
    return {
      rect,
      pos: 'l',
      value: point.y - rect.y1,
    };
  }

  rect = _.last(rects);
  if (point.y > rect.y2) {
    return {
      rect,
      pos: 'r',
      value: point.y - rect.y2,
    };
  }

  // 处理空白区域情况
//  for(let i = 0; i < rects.length; i++) {
//    let rect = rects[i];
//    let nextRect = rects[i + 1];
//    if (rect.y1 >= point.y) {
//      if (point.x <= rect.x1) {
//        return {
//          rect,
//          pos: 'l',
//          value: rect.x1 - point.x,
//        };
//      } else if (point.x <= rect.x2) {
//        return f(rect.x2 - point.x, point.x - rect.x1, rect);
//      } else if (nextRect && point.x < nextRect.x1) {
//        return f(point.x - rect.x2, nextRect.x1 - point.x, rect);
//      }
//    }
//
//  }

  return;
}

//
//function f(t1, t2, rect) {
//  return {
//    rect,
//    pos: t1 < t2 ? 'r' : 'l',
//    value: Math.min(t1, t2),
//  };
//}

export default DropManager;
