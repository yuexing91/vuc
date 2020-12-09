import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import CodeMirror from 'codemirror';

var Pos = CodeMirror.Pos;
CodeMirror.registerHelper('hint', 'javascript', function (editor, options) {
  var cur = editor.getCursor(), token = editor.getTokenAt(cur);
  if (/\b(?:string|comment)\b/.test(token.type)) return;
  var innerMode = CodeMirror.innerMode(editor.getMode(), token.state);
  token.state   = innerMode.state;

  if (!/^[\w$_\u4e00-\u9fa5]*$/.test(token.string)) {
    token = {
      start: cur.ch, end: cur.ch, string: '', state: token.state,
      type: token.string == '.' ? 'property' : null,
    };
  } else if (token.end > cur.ch) {
    token.end    = cur.ch;
    token.string = token.string.slice(0, cur.ch - token.start);
  }

  var tprop = token;
  // If it is a property, find out what it is a property of.
  while (tprop.type == 'property') {
    tprop = editor.getTokenAt(Pos(cur.line, tprop.start));
    if (tprop.string != '.') return;
    tprop = editor.getTokenAt(Pos(cur.line, tprop.start));
    if (!context) var context = [];
    context.push(tprop);
  }

  return Object.assign({
    list: [],
    from: Pos(cur.line, token.start),
    to: Pos(cur.line, token.end),
  }, options.editor.getHint(token, context, editor, options));
});
