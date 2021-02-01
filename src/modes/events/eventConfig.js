export const NATIVE_EVENTS = [
  {
    name: '鼠标事件',
    events: [{
      id: 'click',
      desc: '点击',
      mouseModifier: true,
    }, {
      id: 'dblclick',
      desc: '双击事件',
      mouseModifier: true,
    }, {
      id: 'mousedown',
      desc: '鼠标按钮按下',
      mouseModifier: true,
    }, {
      id: 'mouseup',
      desc: '鼠标按钮释放',
      mouseModifier: true,
    }, {
      id: 'mousemove',
      desc: '鼠标移动',
    }, {
      id: 'mouseover',
      desc: '鼠标移入',
    }, {
      id: 'mouseout',
      desc: '鼠标移出',
    }, {
      id: 'mousewheel',
      desc: '滚轮滚动',
    }, {
      id: 'scroll',
      desc: '滚动条滚动',
    }],
  },
  {
    name: '表单事件',
    events: [{
      id: 'blur',
      desc: '失去焦点',
    }, {
      id: 'change',
      desc: '内容改变',
    }, {
      id: 'contextmenu',
      desc: '上下文菜单',
    }, {
      id: 'focus',
      desc: '获得焦点',
    }, {
      id: 'input',
      desc: '输入',
    }, {
      id: 'submit',
      desc: '提交表单',
    }, {
      id: 'select',
      desc: '文本被选中',
    }],
  },
  {
    name: '键盘事件',
    events: [{
      id: 'keydown',
      desc: '按下按键',
      keyModifier: true,
    }, {
      id: 'keypress',
      desc: '敲击按键',
      keyModifier: true,
    }, {
      id: 'keyup',
      desc: '释放按键',
      keyModifier: true,
    }],
  },
  {
    name: '其他',
    events: [{
      id: 'load',
      desc: '加载成功',
    }, {
      id: 'error',
      desc: '发生错误',
    }],
  }];

export const EVENT_MODIFIERS = [
  {
    id: 'stop',
    desc: '阻止事件继续传播',
  },
  {
    id: 'prevent',
    desc: '阻止事件默认行为',
  },
  {
    id: 'capture',
    desc: '使用捕获模式',
  },
  {
    id: 'self',
    desc: '只当事件发生在当前元素时',
  },
  {
    id: 'once',
    desc: '只触发一次',
  },
  {
    id: 'passive',
    desc: '提升移动端滚动性能',
  },
];

export const KEY_MODIFIERS = [
  {
    id: 'enter',
  },
  {
    id: 'tab',
  },
  {
    id: 'delete',
  },
  {
    id: 'esc',
  },
  {
    id: 'space',
  },
  {
    id: 'up',
  },
  {
    id: 'down',
  },
  {
    id: 'left',
  },
  {
    id: 'right',
  },
];

export const SYS_MODIFIERS = [
  {
    id: 'ctrl',
  },
  {
    id: 'alt',
  },
  {
    id: 'shift',
  },
  {
    id: 'meta',
  },
  {
    id: 'exact',
  },
];

export const MOUSE_MODIFIERS = [
  {
    id: 'left',
  },
  {
    id: 'right',
  },
  {
    id: 'middle',
  },
];

export function getHtmlEvents() {
  return NATIVE_EVENTS;
}

export function getComponentEvents() {
  return NATIVE_EVENTS.map(group => {
    return {
      name: group.name,
      events: group.events.map(event => {
        return Object.assign({}, event, { id: event.id + '.native', label: event.id });
      }),
    };
  });
}

let onRE       = /^@|^v-on:/;
let modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;

export function processEvent(name) {
  let event     = {
    id: '',
    code: '',
    modifiers: [],
    sysModifiers: [],
    keyModifier: undefined,
    mouseModifier: undefined,
  };
  let modifiers = name.match(modifierRE);
  if (modifiers) {
    name = name.replace(modifierRE, '');
  }

  if (onRE.test(name)) {
    name = name.replace(onRE, '');
  }

  if (modifiers) {

    let eventConfig = NATIVE_EVENTS.flatMap(group => group.events).find(event => event.id == name);

    modifiers.forEach(modifier => {

      modifier = modifier.substring(1);

      if (modifier == 'native') {
        name += '.native';
      }

      if (isModifier(EVENT_MODIFIERS, modifier)) {
        event.modifiers.push(modifier);
      }

      if (eventConfig.keyModifier) {
        if (isModifier(KEY_MODIFIERS, modifier)) {
          event.keyModifier = modifier;
        }
      } else {
        if (isModifier(MOUSE_MODIFIERS, modifier)) {
          event.mouseModifier = modifier;
        }
      }

      if (isModifier(SYS_MODIFIERS, modifier)) {
        event.sysModifiers.push(modifier);
      }

    });

  }

  event.id = name;

  return event;
}

export function isEventAttr(name) {
  return onRE.test(name);
}

function isModifier(modifiers, modifier) {
  return modifiers.find(m => m.id == modifier);
}
