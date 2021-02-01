import _ from 'lodash';

export function isNumber(str) {
  return /^\-?[0-9]+\.?[0-9]*$/.test(str);
}

export function camelize(str) {
  return str.replace(/-(\w)/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
}

export function someHandlerIsFalse(handlers, ...args) {
  return handlers.some(handler => {
    let result = handler;
    if (_.isFunction(handler)) {
      result = handler(...args);
    }
    return result === false;
  });
}
