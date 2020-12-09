import { getVucConfig, setVucConfig } from './vucConfig';

export function initConfig(Designer) {
  Designer.prototype.getVucConfig = Designer.getVucConfig = getVucConfig;
  Designer.prototype.setVucConfig = Designer.setVucConfig = setVucConfig;
}

export {
  setVucConfig,
  getVucConfig
}
