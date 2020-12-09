let curCopyNode;
let copyOrCut;
export default {
  copyNode(node){
    curCopyNode = node;
    copyOrCut   = 'copy';
  },

  cutNode(node){
    curCopyNode = node;
    copyOrCut   = 'cut';
  },

  parseNode(node, pos, _node, notChangeSlot){
    if (!_node) {
      if (copyOrCut == 'copy') {
        _node = curCopyNode.clone();
      } else {
        _node = curCopyNode;
      }
    }

    const methodName = pos === 'before' ? 'insterBefore' : 'insterAfter';
    if (_node) {
      if (!notChangeSlot) {
        if (node.attrsMap.slot) {
          node.parent.insterToSlot(_node, node.attrsMap.slot);
        } else if (_node.attrsMap.slot) {
          _node.attrsMap.slot = undefined;
        }
      }

      node[methodName](_node);
      this.selectVucNode(_node);
      if (copyOrCut === 'cut' && _node === curCopyNode) {
        curCopyNode = null;
      }
    }
  },

  insterToSlot(node, slotName, _node){
    if (!_node) {
      if (copyOrCut == 'copy') {
        _node = curCopyNode.clone();
      } else {
        _node = curCopyNode;
      }
    }

    if (_node) {
      node.insterToSlot(_node, slotName || 'default');
      this.selectVucNode(_node);

      if (copyOrCut === 'cut' && _node === curCopyNode) {
        curCopyNode = null;
      }
    }
  },

  repeatNode(node){
    const cloneNode = node.clone();
    node.insterAfter(cloneNode);
    this.selectVucNode(cloneNode);
  },

  moveToBefore(node){
    node.moveToBefore();
    this.selectVucNode(node);
  },

  moveToAfter(node){
    node.moveToAfter();
    this.selectVucNode(node);
  },

  moveToSlot(node, slotName){
    node.moveToSlot(slotName);
    this.selectVucNode(node);
  },

  appendNode(node, dropNode){
    node.appendNode(dropNode);
    this.selectVucNode(dropNode);
  },

  removeNode(node){
    node.remove();
    this.clearSelected();
  },

  getCopyNode(){
    return curCopyNode;
  },

};
