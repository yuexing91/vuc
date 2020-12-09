//拖拽时禁止选中
function noSelection(e) {
  e.preventDefault();
}

export class DropManager {
  constructor() {
    this.isDrop = false;
  }

  //开始拖拽
  dropStart(event, dropVucNode, dropProxyInfo) {
    if (event._stopStartDrop) return;
    this.dropEvent       = event;
    this.dropVucNode     = dropVucNode;
    this.dropProxyInfo   = dropProxyInfo;
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
      this.proxyElement           = document.createElement('div');
      this.proxyElement.className = 'vuc-drag-proxy';
      document.body.appendChild(this.proxyElement);
    }

    if (this.proxyPosElement == null) {
      this.proxyPosElement           = document.createElement('div');
      this.proxyPosElement.className = 'vuc-pos-proxy';
      document.body.appendChild(this.proxyPosElement);
    }

//    this.proxyPosElement.innerText = 'i-row'

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
    this.isDrop        = false;
    this.dropVucNode   = null;
    this.dropProxyInfo = null;
    this.dropEvent     = null;
    if (this.proxyElement) {
      document.body.removeChild(this.proxyElement);
      this.proxyElement = null;
    }
    if (this.proxyPosElement) {
      document.body.removeChild(this.proxyPosElement);
      this.proxyPosElement = null;
    }
  }
}

export default DropManager;
