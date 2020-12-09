const keyCode = {
  'Backspace': 8,
  'Tab': 9,
  'Enter': 13,
  'Shift': 16,
  'Control': 17,
  'Alt': 18,
  'CapeLock': 20,
  'Esc': 27,
  'Space': 32,
  'PageUp': 33,
  'PageDown': 34,
  'End': 35,
  'Home': 36,
  'Left': 37,
  'Up': 38,
  'Right': 39,
  'Down': 40,
  'Insert': 45,
  'Delete': 46,
  'A': 65,
  'B': 66,
  'C': 67,
  'D': 68,
  'E': 69,
  'F': 70,
  'G': 71,
  'H': 72,
  'I': 73,
  'J': 74,
  'K': 75,
  'L': 76,
  'M': 77,
  'N': 78,
  'O': 79,
  'P': 80,
  'Q': 81,
  'R': 82,
  'S': 83,
  'T': 84,
  'U': 85,
  'V': 86,
  'W': 87,
  'X': 88,
  'Y': 89,
  'Z': 90,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  'N1': 96,
  'N2': 97,
  'N3': 98,
  'N4': 99,
  'N5': 100,
  'N6': 101,
  'N7': 102,
  'N8': 103,
  'N9': 104,
  'N0': 105,
  'N*': 106,
  'N+': 107,
  'NEnter': 108,
  'N-': 109,
  'N.': 110,
  'N/': 111,
  'F1': 112,
  'F2': 113,
  'F3': 114,
  'F4': 115,
  'F5': 116,
  'F6': 117,
  'F7': 118,
  'F8': 119,
  'F9': 120,
  'F10': 121,
  'F11': 122,
  'F12': 123,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '|': 220,
  ']': 221,
  '"': 222,
};

export default {

  mounted () {
    this.$el.addEventListener('keydown', this.handleKeyMap);
  },

  methods: {

    _handleKeyMap (e) {

      let curNode = this.currentNode;

      if (e.ctrlKey && !e.altKey && !e.shiftKey) {
        switch (e.keyCode) {
          // ctrl + C 复制
          case keyCode.C:
            this.applyApi('copyNode', curNode);
            return;
          // ctrl + X 剪切
          case keyCode.X:
            this.applyApi('cutNode', curNode);
            return;
          // ctrl + V 粘贴
          case keyCode.V:
            this.applyApi('parseNode', curNode, 'after');
            return;
          // ctrl + I 插入
          case keyCode.I:
            this.applyApi('insterToSlot', curNode);
            return;
          // ctrl + P 重复
          case keyCode.P:
            this.applyApi('repeatNode', curNode);
            return;
          // ctrl + Y 重做
          case keyCode.Y:
            return;
          // ctrl + Z 撤销
          case keyCode.Z:
            return;
        }
      } else if (!e.ctrlKey && e.altKey && !e.shiftKey) {
        switch (e.keyCode) {
          case keyCode.Up:
            this.applyApi('moveToBefore', curNode);
            return;
          case keyCode.Down:
            this.applyApi('moveToAfter', curNode);
            return;
          case keyCode.Left:
            this.applyApi('moveToBefore', curNode);
            return;
          case keyCode.Right:
            this.applyApi('moveToAfter', curNode);
            return;
        }
      } else if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
        switch (e.keyCode) {
          case keyCode.Delete:
            this.applyApi('removeNode', curNode);
            return;
          case keyCode.Insert:
            this.applyApi('insterToSlot', curNode);
            return;
          case keyCode.Up:
            if (curNode.parent) {
              this.__select__parent__child__curNode__ = curNode;
              this.selectVucNode(curNode.parent);
            }
            return;
          case keyCode.Down:
            if (curNode.children && curNode.children.length) {
              let child = curNode.children.includes(this.__select__parent__child__curNode__) ? this.__select__parent__child__curNode__ : curNode.children[0];
              this.selectVucNode(child);
            }
            return;
          case keyCode.Left:
            let before = curNode.getBeforeNode();
            if (before) {
              this.selectVucNode(before);
            }
            return;
          case keyCode.Right:
            let after = curNode.getAfterNode();
            if (after) {
              this.selectVucNode(after);
            }
            return;
          case keyCode.Esc:
            this.clearSelected();
            return;
        }
      }
      return true;
    },

    handleKeyMap (e) {
      if (!this._handleKeyMap(e)) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
  },
};
