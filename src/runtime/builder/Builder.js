import _ from 'lodash';

import vueLoader from './loaders/vueLoader';

class Builder {

  build (file) {
    const modules = this.modules = {};
    let result = vueLoader(this, file.content, file);

    result.modules.forEach(module => {
      const m = this.createModuleFunction(module);
      if (m) {
        this.modules[file.getPath()] = m;
      } else if (_.isObject(module)) {
        this.modules[module.name] = this.createModuleFunction(module.module);
      }
    });

    let installedModules = this.installedModules = {};

    function __vuc_require__ (moduleId, reload) {
      if (installedModules[moduleId] && !reload) {
        return installedModules[moduleId].exports;
      }
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {},
      };
      modules[moduleId].call(module.exports, module, module.exports, __vuc_require__);
      return module.exports;
    }

    this.entry = function () {
      return __vuc_require__(file.getPath());
    };
    this.require = this.entry.require = __vuc_require__;
    return {
      entry: this.entry,
      result,
    };
  }

  createModuleFunction (code) {
    if (_.isString(code)) {
      return new Function('module', '__vuc_exports__', '__vuc_require__', code);
    }
    if (_.isFunction(code)) {
      return code;
    }
  }

}

export default Builder;
