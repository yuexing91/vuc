const vucConfigs = {};

export function getVucConfig(id) {
  id = _.kebabCase(id);
  return vucConfigs[id];
};

export function setVucConfig(config) {
  _.castArray(config.id).forEach(id => {
    id          = id.indexOf('-') ? _.kebabCase(id) : id;
    vucConfigs[id] = config;
  });
};
