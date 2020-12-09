import _ from 'lodash';
import * as esprima from 'esprima';

export default function (builder, content, file) {
  function subContent(range) {
    return content.substring(range[0], range[1]);
  }

  const Program = esprima.parseModule(content, { range: true, attachComment: true });

  function ImportDeclaration(expr) {
    const specifiers = expr.specifiers;
    const depend     = file.findFile(expr.source.value);

    builder.loaderModule(depend);

    const path             = depend.getPath ? depend.getPath() : depend;
    const __vuc__require__ = `__vuc_require__('${path}')`;
    return 'const ' + _.map(specifiers,
        s => {
          const imported = s.imported ? s.imported.name : 'default';
          return `${s.local.name} = ${__vuc__require__}.${imported}`;
        }).join(',') + ';';
  }

  function ExportNamedDeclaration(expr) {
    const declaration  = expr.declaration;
    const declarations = declaration.declarations || [declaration];
    let code           = subContent(declaration.range);
    return code + '\n' + _.map(declarations, d => {
        return `__vuc_exports__.${d.id.name} = ${d.id.name};`;
      }).join('\n');
  }

  const scriptContent = _.map(Program.body, expr => {
    if (expr.type === 'ImportDeclaration') {
      return ImportDeclaration(expr);
    }
    else if (expr.type === 'ExportNamedDeclaration') {
      return ExportNamedDeclaration(expr);
    }
    else if (expr.type === 'ExportDefaultDeclaration') {
      const declaration = expr.declaration;
      return `__vuc_exports__.default = ${subContent(declaration.range)}`;
    }
    else {
      return subContent(expr.range);
    }
  }).join('\n');

  return {
    modules: scriptContent,
    Program,
  };
}
