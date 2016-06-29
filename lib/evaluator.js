const visit = require('./ast').visit;
const util = require('./util');
const timespec = require('timespec');
const comparison = (operator, left, right) => {
  if (operator === '!=' || operator === '!~') {
    return ['not', [operator[1], left, right]];
  }
  return [operator, left, right];
};

module.exports = (ast) => {
  const mode = ['fact'];
  return visit(ast, {
    visitComparison(path) {
      this.traverse(path);
      // Function to handle negating comparisons
      if (mode[0] === 'fact') {
        return ['in', 'certname',
          ['extract', 'certname',
            ['select_fact_contents',
              ['and',
                path.node.left,
                comparison(path.node.operator, 'value', path.node.right)]]]];
      } else if (mode[0] === 'subquery') {
        let left;
        if (path.node.left.length === 1) {
          left = path.node.left[0];
        } else {
          left = path.node.left;
        }
        return comparison(path.node.operator, left, path.node.right);
      } else if (mode[0] === 'resource') {
        if (path.node.left[0] === 'tag') {
          return comparison(path.node.operator, path.node.left[0], path.node.right);
        }
        return comparison(path.node.operator, ['parameter', path.node.left[0]], path.node.right);
      }
      throw Error(`Unknown mode ${mode}`);
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
        const loc = util.formatLocation(path.node);
        throw new Error(`Failed to parse date: \"${path.node.value}\" at ${loc}`);
      }
    },
    visitAndExpression(path) {
      this.traverse(path);
      return ['and', path.node.left, path.node.right];
    },
    visitOrExpression(path) {
      this.traverse(path);
      return ['or', path.node.left, path.node.right];
    },
    visitNotExpression(path) {
      this.traverse(path);
      return ['not', path.node.expression];
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
      return ['in', 'certname',
        ['extract', 'certname',
          [`select_${path.node.endpoint}s`, path.node.expression]]];
    },
    visitRegexpNodeMatch(path) {
      mode.unshift('regexp');
      this.traverse(path);
      mode.shift();
      return ['~', 'certname', util.regexpEscape(path.node.value.join('.'))];
    },
    visitIdentifierPath(path) {
      this.traverse(path);
      if (mode[0] === 'fact') {
        return [
          (path.node.regexp ? '~>' : '='),
          'path',
          path.node.components,
        ];
      }
      return path.node.components;
    },
    visitRegexpIdentifier(path) {
      return path.node.name;
    },
    visitIdentifier(path) {
      if (path.parentPath.node.regexp) {
        return util.regexpEscape(path.node.name);
      }
      return path.node.name;
    },
    visitResource(path) {
      const regexp = (path.node.title.type === 'RegexpIdentifier');
      mode.unshift('resource');
      this.traverse(path);
      mode.shift();
      let { title } = path.node;
      if (!regexp && util.capitalize(path.node.res_type) === 'Class') {
        title = util.capitalizeClass(title);
      }
      const andExpr = ['and',
                        ['=', 'type', util.capitalizeClass(path.node.res_type)],
                        [(regexp ? '~' : '='), 'title', title],
                        ['=', 'exported', path.node.exported]];
      if (path.node.parameters) {
        andExpr.push(path.node.parameters);
      }
      return ['in', 'certname',
        ['extract', 'certname',
          ['select_resources', andExpr]]];
    },
  });
};
