import _ from 'lodash';
import Configurator from '@/config';

const VUC_PROXY_HOOKS = {};

Configurator.registerConfig('setVucProxyOptions', function (key, value) {
  if (_.isObject(key)) {
    _.forEach(key, (v, k) => putVucProxyHooks(k, v));
  } else {
    putVucProxyHooks(key, value);
  }
});

function putVucProxyHooks(key, value) {
  mergeOptions(VUC_PROXY_HOOKS, key, value);
}

export function getVucProxyHooks() {
  return VUC_PROXY_HOOKS;
}

function mergeOptions(obj, key, value) {
  obj[key] = obj[key] || [];
  obj[key].push(value);
}

const EDITOR_HOOKS = {};

Configurator.registerConfig('setEditorHooks', function (key, value) {
  if (_.isObject(key)) {
    _.forEach(key, (v, k) => putEditorHooks(k, v));
  } else {
    putEditorHooks(key, value);
  }
});

function putEditorHooks(key, value) {
  mergeOptions(EDITOR_HOOKS, key, value);
}

export function getEditorHook(name) {
  return EDITOR_HOOKS[name] || [];
}
