import { compile, parseComponent } from '../../vue-template-compiler/build.js';
import JsLoader from './jsLoader';

export default function (builder, content, file) {
  const component      = parseComponent(content);
  const templateTag    = component.template;
  const scriptTag      = component.script;
  const jsResult       = JsLoader(builder, scriptTag.content, file);
  const templateResult = compile(templateTag.content);
  const path           = file.getPath();

  const outPut = `var __vue_script__ = __vuc_require__('${path}?js').default;
      var __vue_template__ = __vuc_require__('${path}?template').default;
      var options = typeof __vue_script__ === 'function' ? __vue_script__.options : __vue_script__;
      if (__vue_template__) {
        options.render = __vue_template__.render;
        options.staticRenderFns = __vue_template__.staticRenderFns;
        options.ast = __vue_template__.ast;
        options._compiled = true;
        options._filePath = '${path}';
      }
      __vuc_exports__.default = __vue_script__;`;

  return {
    modules: [
      { name: path, module: outPut },
      { name: path + '?js', module: jsResult.modules },
      {
        name: path + '?template',
        module: function (module, __vuc_exports__, __vuc_require__) {
          return __vuc_exports__.default = {
            ast: templateResult.ast,
            render: new Function(templateResult.render),
            staticRenderFns: _.map(templateResult.staticRenderFns, r => new Function(r)),
          };
        },
      },
    ],
    ScriptProgram: jsResult.Program,
    ScriptContent: scriptTag.content,
  };
}
