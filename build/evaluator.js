(function() {
  var evaluate, timespec, util, visit;

  visit = require('./ast').visit;

  util = require('./util');

  timespec = require('timespec');

  evaluate = function(ast) {
    var mode;
    mode = ['fact'];
    return visit(ast, {
      visitComparison: function(path) {
        var comparison, left;
        this.traverse(path);
        comparison = function(left, right) {
          if (path.node.operator === '!=' || path.node.operator === '!~') {
            return ['not', [path.node.operator[1], left, right]];
          } else {
            return [path.node.operator, left, right];
          }
        };
        if (mode[0] === 'fact') {
          return ['in', 'certname', ['extract', 'certname', ['select-fact-contents', ['and', path.node.left, comparison('value', path.node.right)]]]];
        } else if (mode[0] === 'subquery') {
          if (path.node.left.length === 1) {
            left = path.node.left[0];
          } else {
            left = path.node.left;
          }
          return comparison(left, path.node.right);
        } else if (mode[0] === 'resource') {
          return comparison(['parameter', path.node.left[0]], path.node.right);
        }
      },
      visitBoolean: function(path) {
        return path.node.value;
      },
      visitString: function(path) {
        return path.node.value;
      },
      visitNumber: function(path) {
        return path.node.value;
      },
      visitDate: function(path) {
        try {
          return timespec.parse(path.node.value).toISOString();
        } catch (_error) {
          throw new Error("Failed to parse date: " + path.node.value);
        }
      },
      visitAndExpression: function(path) {
        this.traverse(path);
        return ['and', path.node.left, path.node.right];
      },
      visitOrExpression: function(path) {
        this.traverse(path);
        return ['or', path.node.left, path.node.right];
      },
      visitNotExpression: function(path) {
        this.traverse(path);
        return ['not', path.node.expression];
      },
      visitQuery: function(path) {
        this.traverse(path);
        return path.node.expression;
      },
      visitParentesizedExpression: function(path) {
        this.traverse(path);
        return path.node.expression;
      },
      visitBlockExpression: function(path) {
        this.traverse(path);
        return path.node.expression;
      },
      visitSubquery: function(path) {
        mode.unshift('subquery');
        this.traverse(path);
        mode.shift();
        return ['in', 'certname', ['extract', 'certname', ["select-" + path.node.endpoint + "s", path.node.expression]]];
      },
      visitRegexpNodeMatch: function(path) {
        mode.unshift('regexp');
        this.traverse(path);
        mode.shift();
        return ['~', 'certname', util.regexpEscape(path.node.value.join('.'))];
      },
      visitIdentifierPath: function(path) {
        path.node.components.forEach(function(component) {
          if (component.type === 'RegexpIdentifier') {
            return path.node.regexp = true;
          }
        });
        this.traverse(path);
        if (mode[0] === 'fact') {
          return [(path.node.regexp ? '~>' : '='), 'path', path.node.components];
        } else {
          return path.node.components;
        }
      },
      visitRegexpIdentifier: function(path) {
        return path.node.name;
      },
      visitIdentifier: function(path) {
        if (path.parentPath.node.regexp) {
          return util.regexpEscape(path.node.name);
        } else {
          return path.node.name;
        }
      },
      visitResource: function(path) {
        var and_expr, title;
        if (path.node.title.type === 'RegexpIdentifier') {
          path.node.regexp = true;
        }
        mode.unshift('resource');
        this.traverse(path);
        mode.shift();
        title = path.node.title;
        if (!path.node.regexp && util.capitalize(path.node.res_type) === 'Class') {
          title = util.capitalizeClass(title);
        }
        and_expr = ['and', ['=', 'type', util.capitalize(path.node.res_type)], [(path.node.regexp ? '~' : '='), 'title', title], ['=', 'exported', path.node.exported]];
        if (path.node.parameters) {
          and_expr.push(path.node.parameters);
        }
        return ['in', 'certname', ['extract', 'certname', ['select-resources', and_expr]]];
      }
    });
  };

  exports.evaluate = evaluate;

}).call(this);
