import _ from 'lodash';
import * as esprima from 'esprima';

class Expr {
  constructor(type, value, raw) {
    this.type = type;
    this.value = value;
    this.raw = raw;
  }

  toCode() {
    return this.raw;
  }

}

export function parseModule(content) {
  return esprima.parseModule(content, {
    range: true,
    attachComment: true,
  });
}

export function parseScript(content) {
  return esprima.parse(content, {
    range: true,
    attachComment: true,
  });
}

export function parseExpression(code) {
  let Program = parseScript(`(${ code })`);

  return _.first(Program.body).expression;
}

/***
 * 返回表单式的简单对象
 * @param code
 */
function getCodeExpressionObj(code) {
  let expr = parseExpression(code);
  return getExpressionObj(expr, code);
}

function getExpressionObj(expr, code) {
  let raw = subCode(expr.range, code);
  return new Expr(expr.type, expr.type === 'Literal' ? expr.value : raw, raw);
}

function extractAnnotations(leadingComments) {
  let annotations = [];
  let remark = [];
  _.forEach(leadingComments, comment => {
    comment.value.split('\n').forEach(line => {
      line = line.replace(/^[\s\*]*/, '');
      if (line.startsWith('@')) {
        let t = line.split(/\s+/);
        annotations.push({
          name: t[0],
          params: t.slice(1),
        });
      } else {
        if (line) {
          remark.push(line);
        }
      }
    });
  });

  function find(name) {
    return _.find(annotations, { name: '@' + name });
  }

  function filter(name) {
    return _.filter(annotations, { name: '@' + name });
  }

  return {
    remark(val) {
      if (val) {
        remark = val.split('\n');
        return;
      }
      return remark.join('\n');
    },
    filter,
    find,
    hasAnnotations(_annotations) {
      return _.some(_annotations, find);
    },
    getParams() {
      return _.map(filter('param'), param => {
        let id = param.params[0];
        let req = !id.startsWith('[');
        return {
          id: req ? id : id.substring(1, id.length - 1),
          req,
          desc: param.params[1],
        };
      });
    },
  };
}

function parseFunctionExpression(expression, code) {

  let Annotations = extractAnnotations(expression.leadingComments);
  //显示名称
  let nameAnnotation = Annotations.find('name');
  let name = nameAnnotation ? nameAnnotation.params[0] : '';

  let _params = Annotations.getParams();

  let functionExpression;
  let id;

  if (expression.type === 'FunctionExpression') {
    functionExpression = expression;
    id = expression.id;
  } else if (expression.type === 'Property') {
    functionExpression = expression.value;
    id = expression.key.name;
  } else {
    throw Error();
  }

  let params = _.map(functionExpression.params, param => {
    let _param = _.find(_params, { id: param.name }) || {};
    return {
      id: param.name,
      desc: _param.desc,
      req: _param.req,
    };
  });

  return {
    id,
    name,
    params,
    bodyCode: getFunctionBodyCode(functionExpression, code),
    Annotations,
  };

}

function parseObjectExpression(objectExpression, code) {
  return _.map(objectExpression.properties, p => {
    let Annotations = extractAnnotations(p.leadingComments);

    let value = {
      id: p.key.name,
      name: Annotations.remark(),
      code: subCode(p.value.range, code),
    };

    if (p.value.type === 'ObjectExpression') {
      value.children = parseObjectExpression(p.value, code);
    }

    return value;
  });
}

function getFunctionBodyNoReturnCode(FunctionExpression, code) {
  let body = FunctionExpression.body.body;
  let t = _.take(body, body.length - 1);
  if (t.length != 0) {
    return subCode([_.first(t).range[0], _.last(t).range[1]], code);
  }
  return '';
}

function getFunctionBodyCode(FunctionExpression, code) {
  return subCode([FunctionExpression.body.range[0] + 1, FunctionExpression.body.range[1] - 1], code);
}

function getFunctionReturnExpression(FunctionExpression) {
  return _.last(FunctionExpression.body.body).argument;
}

function subCode(range, code) {
  return code.substring(range[0], range[1]);
}

// const map = {
//   program: 'Program',
//   exportdefault: 'ExportDefaultDeclaration',
//   object: 'ObjectExpression',
//   property: 'Property',
//   function: 'FunctionDeclaration',
//   return: 'ReturnStatement',
//
//   Program: {
//     get: baseGet,
//   },
//
//   BlockStatement: {
//     get: baseGet,
//   },
//
//   ExportDefaultDeclaration: {
//     get (expr) {
//       return expr.declaration;
//     },
//   },
//   ObjectExpression: {
//     get (expr, type, filter) {
//       var name = filter.split('=')[1];
//       return expr.properties.find(property => property.key.name === name);
//     },
//   },
//
//   Property: {
//     get (expr) {
//       return expr.value;
//     },
//   },
//
//   ReturnStatement: {
//     get (expr) {
//       return expr.argument;
//     },
//   },
//
//   FunctionDeclaration: {
//     get (expr, type, filter) {
//       if (type == 'body') {
//         return expr.body;
//       }
//     },
//     filter (expr, filter) {
//       var name = filter.split('=')[1];
//       return expr.id.name == name;
//     },
//   },
//
//   FunctionExpression: {
//     get (expr, type, filter) {
//       if (type == 'body') {
//         return expr.body;
//       }
//     },
//   },
//
// };
//
// function baseGet (expr, type, filter) {
//   let t = map[type];
//   let handler = map[t];
//   return expr.body.find(expr => {
//     if (expr.type === t) {
//       if (handler.filter) {
//         return handler.filter(expr, filter);
//       }
//       return true;
//     }
//   });
// }
//
// function getAstByPath (expr, paths) {
//   paths.forEach(path => {
//     var handler = map[expr.type];
//     let s = path.indexOf('['), e = path.indexOf(']');
//     let type = path, filter = '';
//     if (s > -1) {
//       type = path.substring(0, s);
//       filter = path.substring(s + 1, e);
//     }
//
//     expr = handler.get(expr, type, filter);
//   });
//   return expr;
// }

export default {
  // getAstByPath,
  getFunctionReturnExpression,
  getFunctionBodyCode,
  getFunctionBodyNoReturnCode,
  getCodeExpressionObj,
  getExpressionObj,
  extractAnnotations,
  parseFunctionExpression,
  parseObjectExpression,
  subCode,
  parseScript,
  parseExpression
};
