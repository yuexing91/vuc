const PANEL_COMPOENTS = {};

export function registerPanel(id, Component) {
  PANEL_COMPOENTS[id] = Component;
}

export function getPanel(id) {
  return PANEL_COMPOENTS[id]
}
