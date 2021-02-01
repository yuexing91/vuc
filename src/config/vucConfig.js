import { camelize } from '@/helpers/lang';

const vucConfigs = {};

export function getVucConfig(id) {
  if (!id) return;
  return vucConfigs[id] || vucConfigs[camelize(id)];
};

export function setVucConfig(config) {
  _.castArray(config.id).forEach(id => {
    id = camelize(id);
    vucConfigs[id] = config;
  });
};
