let visit = require('./ast').visit;
let util = require('./util');
let timespec = require('timespec');

module.exports = (ast) => {
  let mode = ['fact'];
  return visit(ast, {
    visitComparison(path) {
      this.traverse(path);
      // Function to handle negating comparisons
      let comparison = function(left, right) {
        if (path.node.operator === '!=' || path.node.operator === '!~') {
          return [ 'not', [ path.node.operator[1], left, right ] ];
        } else {
          return [ path.node.operator, left, right ];
        }
      };
      if (mode[0] === 'fact') {
        return [ 'in', 'certname',
          [ 'extract', 'certname',
            [ 'select_fact_contents',
              [ 'and',
                path.node.left,
                comparison('value', path.node.right) ] ] ] ];
      } else if (mode[0] === 'subquery') {
        if (path.node.left.length === 1) {
          var left = path.node.left[0];
        } else {
          var { left } = path.node;
        }
        return comparison(left, path.node.right);
      } else if (mode[0] === 'resource') {
        if (path.node.left[0] === 'tag') {
          return comparison(path.node.left[0], path.node.right);
        } else {
          return comparison([ 'parameter', path.node.left[0] ], path.node.right);
        }
      }
    },
    visitBoolean(path) {
      // returning false to use it as a replacement doesn't work
      path.replace(path.node.value);
      return false;
    },
    visitString(path) {
      return path.node.value;
    },
    visitNumber(path) {
      return path.node.value;
    },
    visitDate(path) {
      try {
        return timespec.parse(path.node.value).toISOString();
      } catch (error) {
        throw new Error(`Failed to parse date: \"${path.node.value}\" at ${util.formatLocation(path.node)}`);
      }
    },
    visitAndExpression(path) {
      this.traverse(path);
      return [ 'and', path.node.left, path.node.right ];
    },
    visitOrExpression(path) {
      this.traverse(path);
      return [ 'or', path.node.left, path.node.right ];
    },
    visitNotExpression(path) {
      this.traverse(path);
      return [ 'not', path.node.expression ];
    },
    visitQuery(path) {
      this.traverse(path);
      return path.node.expression;
    },
    visitParentesizedExpression(path) {
      this.traverse(path);
      return path.node.expression;
    },
    visitBlockExpression(path) {
      this.traverse(path);
      return path.node.expression;
    },
    visitSubquery(path) {
      mode.unshift('subquery');
      this.traverse(path);
      mode.shift();
      return [ 'in', 'certname',
        [ 'extract', 'certname',
          [ `select_${path.node.endpoint}s`, path.node.expression ] ] ];
    },
    visitRegexpNodeMatch(path) {
      mode.unshift('regexp');
      this.traverse(path);
      mode.shift();
      return ['~', 'certname', util.regexpEscape(path.node.value.join('.'))];
    },
    visitIdentifierPath(path) {
      path.node.components.forEach(function(component) {
        if (component.type === 'RegexpIdentifier') {
          return path.node.regexp = true;
        }
      });
      this.traverse(path);
      if (mode[0] === 'fact') {
        return [
          (path.node.regexp ? '~>' : '='),
          'path',
          path.node.components
        ];
      } else {
        return path.node.components;
      }
    },
    visitRegexpIdentifier(path) {
      return path.node.name;
    },
    visitIdentifier(path) {
      if (path.parentPath.node.regexp) {
        return util.regexpEscape(path.node.name);
      } else {
        return path.node.name;
      }
    },
    visitResource(path) {
      if (path.node.title.type === 'RegexpIdentifier') {
        path.node.regexp = true;
      }
      mode.unshift('resource');
      this.traverse(path);
      mode.shift();
      let { title } = path.node;
      if (!path.node.regexp && util.capitalize(path.node.res_type) === 'Class') {
        title = util.capitalizeClass(title);
      }
      let and_expr =  [ 'and',
                    [ '=', 'type', util.capitalizeClass(path.node.res_type) ],
                    [ (path.node.regexp ? '~' : '='), 'title', title ],
                    [ '=', 'exported', path.node.exported ] ];
      if (path.node.parameters) {
        and_expr.push(path.node.parameters);
      }
      return [ 'in', 'certname',
        [ 'extract', 'certname',
          [ 'select_resources', and_expr ] ] ];
    }
  });
};
