var puppetdbquery = require('../lib/puppetdbquery');

exports['empty queries'] = function(test) {
  test.equal(puppetdbquery.parse(''), null);
  test.done();
};

exports['double quoted strings'] = function(test) {
  test.deepEqual(puppetdbquery.parse('foo="bar"'),
   [ 'in', 'certname',
    [ 'extract', 'certname',
      [ 'select-fact-contents',
        [ 'and', [ '=', 'path', [ 'foo' ] ], [ '=', 'value', 'bar' ] ] ] ] ]);
  test.done();
};

exports['single quoted strings'] = function(test) {
  test.deepEqual(puppetdbquery.parse('foo=\'bar\''),
    [ 'in', 'certname',
     [ 'extract', 'certname',
       [ 'select-fact-contents',
         [ 'and', [ '=', 'path', [ 'foo' ] ], [ '=', 'value', 'bar' ] ] ] ] ]);
  test.done();
};

exports['precedence'] = function(test) {
  test.deepEqual(puppetdbquery.parse('foo=1 or bar=2 and baz=3'),
    [ 'or',
      [ 'in', 'certname',
        [ 'extract', 'certname',
          [ 'select-fact-contents',
            [ 'and', [ '=', 'path', [ 'foo' ] ], [ '=', 'value', 1 ] ] ] ] ],
      [ 'and',
        [ 'in', 'certname',
          [ 'extract', 'certname',
            [ 'select-fact-contents',
              [ 'and', [ '=', 'path', [ 'bar' ] ], [ '=', 'value', 2 ] ] ] ] ],
        [ 'in', 'certname',
          [ 'extract', 'certname',
            [ 'select-fact-contents',
              [ 'and', [ '=', 'path', [ 'baz' ] ], [ '=', 'value', 3 ] ] ] ] ] ] ]);
  test.deepEqual(puppetdbquery.parse('(foo=1 or bar=2) and baz=3'),
    [ 'and',
      [ 'or',
        [ 'in', 'certname',
          [ 'extract', 'certname',
            [ 'select-fact-contents',
              [ 'and', [ '=', 'path', [ 'foo' ] ], [ '=', 'value', 1 ] ] ] ] ],
        [ 'in', 'certname',
          [ 'extract', 'certname',
            [ 'select-fact-contents',
              [ 'and', [ '=', 'path', [ 'bar' ] ], [ '=', 'value', 2 ] ] ] ] ] ],
      [ 'in', 'certname',
        [ 'extract', 'certname',
          [ 'select-fact-contents',
            [ 'and', [ '=', 'path', [ 'baz' ] ], [ '=', 'value', 3 ] ] ] ] ] ]);
  test.done();
};

exports['resource queries with type and title'] = function(test) {
  test.deepEqual(puppetdbquery.parse('file[foo]'),
    [ "in", "certname",
      [ "extract", "certname",
        [ "select-resources",
          [ "and",
            [ "=", "type", "File" ],
            [ "=", "title", "foo" ],
            [ "=", "exported", false ] ] ] ] ]);
  test.done();
};

exports['resource queries with type, title and parameters'] = function(test) {
  test.deepEqual(puppetdbquery.parse('file[foo]{bar=baz}'),
    [ "in", "certname",
      [ "extract", "certname",
        [ "select-resources",
          [ "and",
            [ "=", "type", "File" ],
            [ "=", "title", "foo" ],
            [ "=", "exported", false ],
            [ "=", [ "parameter", "bar" ], "baz" ] ] ] ] ]);
  test.done();
};

exports['precedence within resource parameter queries'] = function(test) {
  test.deepEqual(puppetdbquery.parse('file[foo]{foo=1 or bar=2 and baz=3}'),
    [ "in", "certname",
      [ "extract", "certname",
        [ "select-resources",
          [ "and",
            [ "=", "type", "File" ],
            [ "=", "title", "foo" ],
            [ "=", "exported", false ],
            [ "or",
              [ "=", [ "parameter", "foo" ], 1 ],
              [ "and",
                [ "=", [ "parameter", "bar" ], 2 ],
                [ "=", [ "parameter", "baz" ], 3 ] ] ] ] ] ] ]);
  test.deepEqual(puppetdbquery.parse('file[foo]{(foo=1 or bar=2) and baz=3}'),
    [ "in", "certname",
      [ "extract", "certname",
        [ "select-resources",
          [ "and",
            [ "=", "type", "File" ],
            [ "=", "title", "foo" ],
            [ "=", "exported", false ],
            [ "and",
              [ "or",
                [ "=", [ "parameter", "foo" ], 1 ],
                [ "=", [ "parameter", "bar" ], 2 ] ],
                [ "=", [ "parameter", "baz" ], 3 ] ] ] ] ] ]);
  test.done();
};

exports['capitalize class names'] = function(test) {
  test.deepEqual(puppetdbquery.parse('class[foo::bar]'),
    [ "in", "certname",
      [ "extract", "certname",
        [ "select-resources",
          [ "and",
            [ "=", "type", "Class" ],
            [ "=", "title", "Foo::Bar" ],
            [ "=", "exported", false ] ] ] ] ]);
  test.done();
};

exports['resource queries with regeexp title matching'] = function(test) {
  test.deepEqual(puppetdbquery.parse('file[~foo]'),
    [ "in", "certname",
      [ "extract", "certname",
        [ "select-resources",
          [ "and",
            [ "=", "type", "File" ],
            [ "~", "title", "foo" ],
            [ "=", "exported", false ] ] ] ] ]);
  test.done();
};

exports['not expressions'] = function(test) {
  test.deepEqual(puppetdbquery.parse('not foo=bar'),
    [ 'not',
      [ 'in', 'certname',
        [ 'extract', 'certname',
          [ 'select-fact-contents',
            [ 'and', [ '=', 'path', [ 'foo' ] ], [ '=', 'value', 'bar' ] ] ] ] ] ]);
  test.done();
};

// Expressions where key starts with a dot should match on the
// specified property of the object itself
exports['.key expression'] = function(test) {
  test.deepEqual(puppetdbquery.parse('.certname="foo.bar.com"'),
    [ "=", "certname", "foo.bar.com" ]);
  test.done();
};

// An expression with just a string should create a regexp
// match on the certname
exports['single string expressions'] = function(test) {
  test.deepEqual(puppetdbquery.parse('foo.bar.com'),
    [ "~", "certname", "foo\\.bar\\.com" ]);
  test.done();
};

exports['exported resources'] = function(test) {
  test.deepEqual(puppetdbquery.parse('@@file[foo]'),
    [ "in", "certname",
      [ "extract", "certname",
        [ "select-resources",
          [ "and",
            [ "=", "type", "File" ],
            [ "=", "title", "foo" ],
            [ "=", "exported", true ] ] ] ] ]);
  test.done();
};

exports['structured facts'] = function(test) {
  test.deepEqual(puppetdbquery.parse('foo.bar=baz'),
    [ 'in', 'certname',
      [ 'extract', 'certname',
        [ 'select-fact-contents',
          [ 'and',
            [ '=', 'path', [ 'foo', 'bar' ] ],
            [ '=', 'value', 'baz' ] ] ] ] ]);
  test.done();
};

exports['structured facts with array component'] = function(test) {
  test.deepEqual(puppetdbquery.parse('foo.bar.0=baz'),
    [ 'in', 'certname',
      [ 'extract', 'certname',
        [ 'select-fact-contents',
          [ 'and',
            [ '=', 'path', [ 'foo', 'bar', 0 ] ],
            [ '=', 'value', 'baz' ] ] ] ] ]);
  test.done();
};

exports['structured facts with match operator'] = function(test) {
  test.deepEqual(puppetdbquery.parse('foo.bar.~".*"=baz'),
    [ 'in', 'certname',
      [ 'extract', 'certname',
        [ 'select-fact-contents',
          [ 'and',
            [ '~>', 'path', [ 'foo', 'bar', '.*' ] ],
            [ '=', 'value', 'baz' ] ] ] ] ]);
  test.done();
};
