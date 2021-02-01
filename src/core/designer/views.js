const VIEW_COMPONENTS = {};
import DesignerView from './DesignerView';

export function registerView(id, Component) {
  let options = {
    props: {
      id: String,
      title: String,
    },
    render(h) {
      return h(DesignerView, {
        props: {
          id: this.id,
          title: this.title,
        },
      }, [
        h(Component, {
          props: this.$attrs,
        }),
      ]);
    },
  };

  VIEW_COMPONENTS[id] = options;
}

export function getView(id) {
  return VIEW_COMPONENTS[id];
}

export function getAllView() {
  return VIEW_COMPONENTS;
}
