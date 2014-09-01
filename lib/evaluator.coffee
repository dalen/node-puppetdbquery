visit = require('./ast').visit
util = require('./util')

evaluate = (ast) ->
  mode = ['fact']
  visit ast, {
    visitComparison: (path) ->
      @traverse(path)
      if mode[0] == 'fact'
        [ 'in', 'certname',
          [ 'extract', 'certname',
            [ 'select-fact-contents'
              ['and',
                path.node.left,
                [ path.node.operator, 'value', path.node.right ] ] ] ] ]
      else if mode[0] == 'subquery'
        if path.node.left.length == 1
          left = path.node.left[0]
        else
          left = path.node.left
        [ path.node.operator, left, path.node.right ]
      else if mode[0] == 'resource'
        [ path.node.operator,
          [ 'parameter', path.node.left[0] ],
          path.node.right ]
    visitBoolean: (path) ->
      path.node.value
    visitString: (path) ->
      path.node.value
    visitNumber: (path) ->
      path.node.value
    visitAndExpression: (path) ->
      @traverse(path)
      [ 'and', path.node.left, path.node.right ]
    visitOrExpression: (path) ->
      @traverse(path)
      [ 'or', path.node.left, path.node.right ]
    visitNotExpression: (path) ->
      @traverse(path)
      [ 'not', path.node.expression ]
    visitQuery: (path) ->
      @traverse(path)
      path.node.expression
    visitParentesizedExpression: (path) ->
      @traverse(path)
      path.node.expression
    visitBlockExpression: (path) ->
      @traverse(path)
      path.node.expression
    visitSubquery: (path) ->
      mode.unshift 'subquery'
      @traverse(path)
      mode.shift()
      [ 'in', 'certname',
        [ 'extract', 'certname',
          [ "select-#{path.node.endpoint}s", path.node.expression ] ] ]
    visitRegexpNodeMatch: (path) ->
      mode.unshift 'regexp'
      @traverse(path)
      mode.shift()
      ['~', 'certname', util.regexpEscape(path.node.value.join '.')]
    visitIdentifierPath: (path) ->
      path.node.components.forEach (component) ->
        if component.type == 'RegexpIdentifier'
          path.node.regexp = true
      @traverse(path)
      if mode[0] == 'fact'
        [
          (if path.node.regexp then '~>' else '=')
          'path'
          path.node.components
        ]
      else
        path.node.components
    visitRegexpIdentifier: (path) ->
      path.node.name
    visitIdentifier: (path) ->
      if path.parentPath.node.regexp
        util.regexpEscape path.node.name
      else
        path.node.name
    visitResource: (path) ->
      if path.node.title.type == 'RegexpIdentifier'
        path.node.regexp = true
      mode.unshift 'resource'
      @traverse(path)
      mode.shift()
      title = path.node.title
      if !path.node.regexp && util.capitalize(path.node.res_type) == 'Class'
        title = util.capitalizeClass(title)
      and_expr =  [ 'and',
                    [ '=', 'type', util.capitalize(path.node.res_type) ],
                    [ (if path.node.regexp then '~' else '='), 'title', title ],
                    [ '=', 'exported', path.node.exported ] ]
      if path.node.parameters
        and_expr.push(path.node.parameters)
      [ 'in', 'certname',
        [ 'extract', 'certname',
          [ 'select-resources', and_expr ] ] ]
  }

exports.evaluate = evaluate
