import Builder from './Builder.js';

export function installModule(name, _module) {
  Builder.installModule(name, function (module, __vuc_exports__, __vuc_require__) {
    __vuc_exports__.default = _module;
  });
}

export default Builder;
