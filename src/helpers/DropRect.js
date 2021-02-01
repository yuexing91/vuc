import _ from 'lodash';


function isBlock($el) {
  let computedStyle = window.getComputedStyle($el);

  if (['left', 'right'].includes(computedStyle.float)) {
    return false;
  }

  if (['table', 'block'].includes(computedStyle.display)) {
    return true;
  }
  return false;
}

class DropRect {
  constructor(rect, data, el) {
    this.rect = rect;
    this.el = el;
    this.data = data;
    this.x = rect.x;
    this.y = rect.y;
    this.x1 = rect.x;
    this.y1 = rect.y;
    this.x2 = rect.x + rect.width;
    this.y2 = rect.y + rect.height;
    this.width = rect.width;
    this.height = rect.height;
    this.isBlock = isBlock(el);
  }

  isInside(x, y) {
    if (x < this.x1 || x > this.x2 || y < this.y1 || y > this.y2) {
      return false;
    }
    return true;
  }

  getInsidePos(x, y) {
    const dis = [];

    if (this.isBlock) {
      dis.push({
        pos: 't',
        value: y - this.y1,
      });
      dis.push({
        pos: 'b',
        value: this.y2 - y,
      });
    } else {
      dis.push({
        pos: 'l',
        value: x - this.x1,
      });
      dis.push({
        pos: 'r',
        value: this.x2 - x,
      });
    }

    return Object.assign({ rect: this }, _.minBy(dis, 'value'));
  }

  getPos(x, y) {
    if (this.isBlock) {
      if (y < this.y1 && x >= this.x1 && x <= this.x2) {
        return 't';
      }
      if (y > this.y2 && x >= this.x1 && x <= this.x2) {
        return 'b';
      }
    } else {
      if (x < this.x1 && y >= this.y1 && y <= this.y2) {
        return 'l';
      }
      if (x > this.x2 && y >= this.y1 && y <= this.y2) {
        return 'r';
      }
    }
  }

  getPosDis(x, y) {
    const pos = this.getPos(x, y);

    let value = -1;

    if (pos === 't') {
      value = this.y1 - y;
    }
    if (pos === 'b') {
      value = y - this.y2;
    }

    if (pos === 'l') {
      value = this.x1 - x;
    }
    if (pos === 'r') {
      value = x - this.x2;
    }
    return {
      pos,
      value,
      rect: this,
    };
  }

  getStyle(pos) {
    const r = this;

    switch (pos) {
      case 't':
        return {
          left: r.x + 'px',
          top: r.y - 1 + 'px',
          width: r.width + 'px',
          height: '2px',
        };
      case 'l':
        return {
          left: r.x - 1 + 'px',
          top: r.y + 'px',
          width: '2px',
          height: r.height + 'px',
        };
      case 'b':
        return {
          left: r.x + 'px',
          top: r.y + r.height + 1 + 'px',
          width: r.width + 'px',
          height: '2px',
        };
      case 'r':
        return {
          left: r.x + r.width + 1 + 'px',
          top: r.y + 'px',
          width: '2px',
          height: r.height + 'px',
        };
    }

    // if (pos === 't') {
    //   return {
    //     left: r.x + 'px',
    //     top: r.y - 1 + 'px',
    //     width: r.width + 'px',
    //     height: '2px',
    //   };
    // } else if (pos === 'l') {
    //   return {
    //     left: r.x - 1 + 'px',
    //     top: r.y + 'px',
    //     width: '2px',
    //     height: r.height + 'px',
    //   };
    // } else if (pos === 'b') {
    //   return {
    //     left: r.x + 'px',
    //     top: r.y + r.height + 1 + 'px',
    //     width: r.width + 'px',
    //     height: '2px',
    //   };
    // } else if (pos === 'r') {
    //   return {
    //     left: r.x + r.width + 1 + 'px',
    //     top: r.y + 'px',
    //     width: '2px',
    //     height: r.height + 'px',
    //   };
    // }
  }

}

export default DropRect;
