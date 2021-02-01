import _ from 'lodash';
import { isNumber } from '@/helpers/lang';

const EDITOR_COMPONENTS = {};

function formatToEditor(str) {
  let sp1 = str.split('?');
  let props = {};
  if (sp1[1]) {
    sp1[1].split('&').map(prop => {
      let sp2 = prop.split('=');
      let v = sp2[1];
      if (v === 'true') {
        v = true;
      } else if (v === 'false') {
        v = false;
      } else if (isNumber(v)) {
        v = parseFloat(v);
      }
      props[sp2[0]] = v;
    });
  }
  return {
    type: sp1[0],
    props,
  };
}

export function parseEditor(opts) {
  let editor = _.isString(opts) ? formatToEditor(opts) : formatToEditor(opts.type);
  if (opts.props) {
    Object.assign(editor.props, opts.props);
    editor = Object.assign({}, opts, editor);
  }
  return editor;
}

export function getEditorConfig(id) {
  return EDITOR_COMPONENTS[id].editorConfig
}

export function registerAttrEditor(Editor) {
  EDITOR_COMPONENTS[Editor.editorConfig.id] = Editor;
}

export function getEditorComponent(id) {
  return EDITOR_COMPONENTS[id];
}
