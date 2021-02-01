import { getVucConfig, setVucConfig } from './vucConfig';

const Configurator = {
  setVucConfig,
  getVucConfig,
  setConfig,
  getConfig,
  registerConfig(key, configFn) {
    Configurator[key] = configFn;
  },
};

const CONFIGS = {};

export function initConfig(Designer) {

  Designer.registerExtension('setConfig', setConfig);
  Designer.registerExtension('getConfig', getConfig);
  Designer.registerExtension('getVucConfig', getVucConfig);
  Designer.registerExtension('setVucConfig', setVucConfig);

  Designer.prototype.setConfig = setConfig;
  Designer.prototype.getConfig = getConfig;
  Designer.prototype.getVucConfig = getVucConfig;
  Designer.prototype.setVucConfig = setVucConfig;
}

export function setConfig(key, value) {
  CONFIGS[key] = value;
}

export function getConfig(key, defaultValue) {
  return CONFIGS.hasOwnProperty(key) ? CONFIGS[key] : defaultValue;
}

export {
  setVucConfig,
  getVucConfig,
};

export default Configurator;
