//拖拽时禁止选中
function noSelection(e) {
  e.preventDefault();
}

class Drag {
  constructor(option) {
    option = option || {};
    this.isDrag = false;
    this.proxyElement = this.createProxyElement(option.proxyClassName);
    this.cursorElement = this.createProxyElement(option.cursorClassName);
  }

  dragStart(event, option, dragData) {
    option = option || {};
    this.proxy = option.proxy || {};
    this.dragData = dragData;
    this.startEvent = event;
    this.dropSuccess = false;

    this.proxyElement.innerText = this.proxy.text || '';

    let move = e => {
      if (option.onMove) {
        option.onMove(e);
      }
      this.dragMove(e);
    };
    let up = e => {
      if (option.onDrop) {
        option.onDrop(e);
      }

      if (this.dropSuccess && option.onDropSuccess) {
        option.onDropSuccess(e);
      }

      window.removeEventListener('selectstart', noSelection);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      this.dragOver(e);
    };

    window.addEventListener('selectstart', noSelection);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return this;
  }

  dragMove(curEvent) {
    //排除点击手抖
    const dragEvent = this.startEvent;
    if (!dragEvent.first) {
      if (curEvent.timeStamp - dragEvent.timeStamp < 500 && Math.abs(curEvent.pageX - dragEvent.pageX) < 10 && Math.abs(curEvent.pageY - dragEvent.pageY) < 10) {
        return;
      } else {
        dragEvent.first = true;
      }
    }

    this.isDrag = true;

    if (!inBody(this.proxyElement)) {
      document.body.appendChild(this.proxyElement);
    }

    let { x = 0, y = 0 } = this.proxy;

    Object.assign(this.proxyElement.style, {
      left: curEvent.clientX - x + 'px',
      top: curEvent.clientY - y + 'px',
    });

    if (!this.isShowCursor) {
      this.cursorElement.style.display = 'none';
    }
    this.isShowCursor = false;
  }

  showCursor(cursor) {
    if (!inBody(this.cursorElement)) {
      document.body.appendChild(this.cursorElement);
    }

    Object.assign(this.cursorElement.style, {
      display: 'block',
      left: cursor.left + 'px',
      top: cursor.top + 'px',
      width: cursor.width + 'px',
      height: cursor.height + 'px',
    });

    this.isShowCursor = true;

  }

  dragOver() {
    this.isDrag = false;
    this.startEvent = null;
    this.proxy = null;
    if (inBody(this.cursorElement)) {
      document.body.removeChild(this.cursorElement);
    }
    if (inBody(this.proxyElement)) {
      document.body.removeChild(this.proxyElement);
    }
  }

  createProxyElement(className, innerText) {
    let proxyElement = document.createElement('div');
    proxyElement.className = className || '';
    proxyElement.innerText = innerText || '';
    return proxyElement;
  }

}

function inBody(el) {
  for(let child of document.body.children) {
    if (child === el) return true;
  }
}

export default Drag;
