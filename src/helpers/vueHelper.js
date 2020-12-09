let sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get () {
  },
  set () {
  },
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function defineComputed (
  target,
  key,
  userDef,
) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (watcher.deps[0] && watcher.deps[0].constructor.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}

function createGetterInvoker (fn) {
  return function computedGetter () {
    return fn.call(this, this);
  };
}

function noop () {

}

export { proxy, defineComputed };
