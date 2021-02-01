export default class Combo {
  constructor(template, rootNode, nodeMap, nodeConfig) {
    this.template = template;
    this.rootNode = rootNode;
    this.nodeMap = nodeMap;
    this.nodeConfig = nodeConfig;
  }

  includeNode(vucNode) {
    return Object.values(this.nodeMap).includes(vucNode);
  }

  eachNodes(iterator) {
    Object.values(this.nodeMap).forEach(n => iterator(n, n === this.rootNode));
  }

  getName() {
    return this.template.name;
  }

  getOptionConfigs() {
    if (_.isFunction(this.template.configs)) {
      return this.template.configs.call(this, this.nodeMap);
    }
    return this.template.configs;
  }

  getNode(key) {
    return this.nodeMap[key];
  }

  getNodeConfig(node) {
    return this.nodeConfig[node._astId];
  }

  onDragover(dropData, targetNode, pos) {
    if (this.template.onDragover) {
      return this.template.onDragover(dropData, targetNode, pos);
    }
  }
}
