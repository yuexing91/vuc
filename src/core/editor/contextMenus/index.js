//获取node包含的slot列表
function getNodeInsterSlotHandler(node) {
  let config = node.getConfig();
  if (config && config.slots) {
    let children = _.map(config.slots, slot => {
      return {
        text: slot.name,
        slot,
        handler(node, editor){
          editor.applyApi('insterToSlot', node, slot.slot);
        },
      };
    });
    return children;
  }
}

//node 可以移动到同级的slot列表
function getNodeMoveSlotHandler(node) {
  let parent = node.getParentNode();
  if (parent) {
    let config = parent.getConfig();
    if (config && config.slots) {
      let slotName = node.getBelongSlotName();
      let children = _.map(config.slots, slot => {
        if (slot.slot === slotName) return;
        return {
          text: slot.name,
          slot,
          handler(node, editor){
            editor.applyApi('moveToSlot', node, slot.slot);
          },
        };
      }).filter(v => v);
      return children;
    }
  }
}

function createBaseMenus() {
  return [
    {
      text: '移动',
      handler(node, editor){
        editor.dropStart(this.event, node, {
          x: 0,
          y: 0,
          width: '100px',
          height: '30px',
        });
      },
    },
    {
      text: '前移',
      handler(node, editor){
        editor.applyApi('moveToBefore', node);
      },
    },
    {
      text: '后移',
      handler(node, editor){
        editor.applyApi('moveToAfter', node);
      },
    },
    {
      text: '删除',
      handler(node, editor){
        editor.applyApi('removeNode', node);
      },
    },
  ];

}

function createParseMenus(curNode) {

  let insterItem = {
    text: '粘贴',
    children: [
      {
        text: '前面',
        handler(node, editor){
          editor.applyApi('parseNode', node, 'before');
        },
      },
      {
        text: '后面',
        handler(node, editor){
          editor.applyApi('parseNode', node, 'after');
        },
      },
    ],
  };
  if (curNode) {
    let slotMenus = getNodeInsterSlotHandler(curNode);
    if (slotMenus) {
      insterItem.children.push(...slotMenus);
    }
  }

  return [
    {
      text: '复制',
      handler(node, editor){
        editor.applyApi('copyNode', node);
      },
    },
    {
      text: '剪切',
      handler(node, editor){
        editor.applyApi('cutNode', node);
      },
    },
    {
      text: '重复',
      handler(node, editor){
        editor.applyApi('repeatNode', node);
      },
    },
    insterItem,
  ];
}

function createMoveMenus(curNode) {
  if (curNode) {
    let moveMenus = getNodeMoveSlotHandler(curNode);

    if (!_.isEmpty(moveMenus)) {
      return [{
        text: '移动到',
        children: moveMenus,
      }];
    }
  }

  return [];
}

export function createMenus(curNode) {

  let menus = createBaseMenus();

  let parseMenus = createParseMenus(curNode);

  let moveMenus = createMoveMenus(curNode);

  if (!_.isEmpty(parseMenus)) {
    menus.push({
      divided: true,
    });
    menus = menus.concat(parseMenus);
  }

  if (!_.isEmpty(moveMenus)) {
    menus.push({
      divided: true,
    });
    menus = menus.concat(moveMenus);
  }

  return menus;
};

