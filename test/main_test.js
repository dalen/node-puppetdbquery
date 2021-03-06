const puppetdbquery = require('../main');

exports['empty queries'] = (test) => {
  test.equal(puppetdbquery.parse('', null));
  return test.done();
};

exports['double quoted strings'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo="bar"'),
   ['in', 'certname',
    ['extract', 'certname',
      ['select_fact_contents',
        ['and', ['=', 'path', ['foo']], ['=', 'value', 'bar']]]]]);
  return test.done();
};

exports['single quoted strings'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo=\'bar\''),
    ['in', 'certname',
     ['extract', 'certname',
       ['select_fact_contents',
         ['and', ['=', 'path', ['foo']], ['=', 'value', 'bar']]]]]);
  return test.done();
};

exports['not equal operator !='] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo!=bar'),
    ['in', 'certname',
     ['extract', 'certname',
       ['select_fact_contents',
         ['and',
           ['=', 'path', ['foo']],
           ['not', ['=', 'value', 'bar']]]]]]);
  return test.done();
};

exports['>= operator'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo>=1'),
    ['in', 'certname',
     ['extract', 'certname',
       ['select_fact_contents',
         ['and',
           ['=', 'path', ['foo']],
           ['>=', 'value', 1]]]]]);
  return test.done();
};

exports['<= operator'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo<=1'),
    ['in', 'certname',
     ['extract', 'certname',
       ['select_fact_contents',
         ['and',
           ['=', 'path', ['foo']],
           ['<=', 'value', 1]]]]]);
  return test.done();
};

exports['< operator'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo<1'),
    ['in', 'certname',
     ['extract', 'certname',
       ['select_fact_contents',
         ['and',
           ['=', 'path', ['foo']],
           ['<', 'value', 1]]]]]);
  return test.done();
};

exports['> operator'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo>1'),
    ['in', 'certname',
     ['extract', 'certname',
       ['select_fact_contents',
         ['and',
           ['=', 'path', ['foo']],
           ['>', 'value', 1]]]]]);
  return test.done();
};

exports['!~ operator'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo!~bar'),
    ['in', 'certname',
     ['extract', 'certname',
       ['select_fact_contents',
         ['and',
           ['=', 'path', ['foo']],
           ['not', ['~', 'value', 'bar']]]]]]);
  return test.done();
};

exports.precedence = (test) => {
  test.deepEqual(puppetdbquery.parse('foo=1 or bar=2 and baz=3'),
    ['or',
      ['in', 'certname',
        ['extract', 'certname',
          ['select_fact_contents',
            ['and', ['=', 'path', ['foo']], ['=', 'value', 1]]]]],
      ['and',
        ['in', 'certname',
          ['extract', 'certname',
            ['select_fact_contents',
              ['and', ['=', 'path', ['bar']], ['=', 'value', 2]]]]],
        ['in', 'certname',
          ['extract', 'certname',
            ['select_fact_contents',
              ['and',
                ['=', 'path', ['baz']],
                ['=', 'value', 3]]]]]]]);
  test.deepEqual(puppetdbquery.parse('(foo=1 or bar=2) and baz=3'),
    ['and',
      ['or',
        ['in', 'certname',
          ['extract', 'certname',
            ['select_fact_contents',
              ['and', ['=', 'path', ['foo']], ['=', 'value', 1]]]]],
        ['in', 'certname',
          ['extract', 'certname',
            ['select_fact_contents',
              ['and',
                ['=', 'path', ['bar']],
                ['=', 'value', 2]]]]]],
      ['in', 'certname',
        ['extract', 'certname',
          ['select_fact_contents',
            ['and', ['=', 'path', ['baz']], ['=', 'value', 3]]]]]]);
  return test.done();
};


exports['resource queries with type and title'] = (test) => {
  test.deepEqual(puppetdbquery.parse('file[foo]'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_resources',
          ['and',
            ['=', 'type', 'File'],
            ['=', 'title', 'foo'],
            ['=', 'exported', false]]]]]);
  return test.done();
};

exports['resource queries with type, title and parameters'] = (test) => {
  test.deepEqual(puppetdbquery.parse('file[foo]{bar=baz}'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_resources',
          ['and',
            ['=', 'type', 'File'],
            ['=', 'title', 'foo'],
            ['=', 'exported', false],
            ['=', ['parameter', 'bar'], 'baz']]]]]);
  return test.done();
};

exports['resource queries with tag'] = (test) => {
  test.deepEqual(puppetdbquery.parse('file[foo]{tag=baz}'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_resources',
          ['and',
            ['=', 'type', 'File'],
            ['=', 'title', 'foo'],
            ['=', 'exported', false],
            ['=', 'tag', 'baz']]]]]);
  return test.done();
};

exports['precedence within resource parameter queries'] = (test) => {
  test.deepEqual(puppetdbquery.parse('file[foo]{foo=1 or bar=2 and baz=3}'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_resources',
          ['and',
            ['=', 'type', 'File'],
            ['=', 'title', 'foo'],
            ['=', 'exported', false],
            ['or',
              ['=', ['parameter', 'foo'], 1],
              ['and',
                ['=', ['parameter', 'bar'], 2],
                ['=', ['parameter', 'baz'], 3]]]]]]]);
  test.deepEqual(puppetdbquery.parse('file[foo]{(foo=1 or bar=2) and baz=3}'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_resources',
          ['and',
            ['=', 'type', 'File'],
            ['=', 'title', 'foo'],
            ['=', 'exported', false],
            ['and',
              ['or',
                ['=', ['parameter', 'foo'], 1],
                ['=', ['parameter', 'bar'], 2]],
                ['=', ['parameter', 'baz'], 3]]]]]]);
  return test.done();
};

exports['capitalize class names'] = (test) => {
  test.deepEqual(puppetdbquery.parse('class[foo::bar]'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_resources',
          ['and',
            ['=', 'type', 'Class'],
            ['=', 'title', 'Foo::Bar'],
            ['=', 'exported', false]]]]]);
  return test.done();
};

exports['capitalize resource names'] = (test) => {
  test.deepEqual(puppetdbquery.parse('apache::vhost["example.com"]'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_resources',
          ['and',
            ['=', 'type', 'Apache::Vhost'],
            ['=', 'title', 'example.com'],
            ['=', 'exported', false]]]]]);
  return test.done();
};

exports['resource queries with regeexp title matching'] = (test) => {
  test.deepEqual(puppetdbquery.parse('file[~foo]'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_resources',
          ['and',
            ['=', 'type', 'File'],
            ['~', 'title', 'foo'],
            ['=', 'exported', false]]]]]);
  return test.done();
};


exports['not expressions'] = (test) => {
  test.deepEqual(puppetdbquery.parse('not foo=bar'),
    ['not',
      ['in', 'certname',
        ['extract', 'certname',
          ['select_fact_contents',
            ['and',
              ['=', 'path', ['foo']],
              ['=', 'value', 'bar']]]]]]);
  return test.done();
};


// Expressions where key starts with a dot should match on the
// specified property of the object itself
// exports['.key expression'] = (test) ->
//  test.deepEqual(puppetdbquery.parse('.certname="foo.bar.com"'),
//    [ "=", "certname", "foo.bar.com" ])
//  test.done()
//

// An expression with just a string should create a regexp
// match on the certname
exports['single string expressions'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo.bar.com'),
    ['~', 'certname', 'foo\\.bar\\.com']);
  return test.done();
};

exports['exported resources'] = (test) => {
  test.deepEqual(puppetdbquery.parse('@@file[foo]'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_resources',
          ['and',
            ['=', 'type', 'File'],
            ['=', 'title', 'foo'],
            ['=', 'exported', true]]]]]);
  return test.done();
};


exports['structured facts'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo.bar=baz'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_fact_contents',
          ['and',
            ['=', 'path', ['foo', 'bar']],
            ['=', 'value', 'baz']]]]]);
  return test.done();
};

exports['structured facts with array component'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo.bar.0=baz'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_fact_contents',
          ['and',
            ['=', 'path', ['foo', 'bar', 0]],
            ['=', 'value', 'baz']]]]]);
  return test.done();
};

exports['structured facts with match operator'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo.bar.~".*"=baz'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_fact_contents',
          ['and',
            ['~>', 'path', ['foo', 'bar', '.*']],
            ['=', 'value', 'baz']]]]]);
  return test.done();
};

exports['structured facts with wildcard operator'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo.bar.*=baz'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_fact_contents',
          ['and',
            ['~>', 'path', ['foo', 'bar', '.*']],
            ['=', 'value', 'baz']]]]]);
  return test.done();
};

exports['#node subqueries'] = (test) => {
  test.deepEqual(puppetdbquery.parse('#node.catalog_environment=production'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_nodes',
          ['=', 'catalog_environment', 'production']]]]);
  return test.done();
};

exports['#node subqueries with block of conditions'] = (test) => {
  test.deepEqual(
    puppetdbquery.parse('#node { catalog_environment=production }'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_nodes',
          ['=', 'catalog_environment', 'production']]]]);
  return test.done();
};

exports['#node subquery combined with fact query'] = (test) => {
  test.deepEqual(
    puppetdbquery.parse('#node.catalog_environment=production and foo=bar'),
    ['and',
      ['in', 'certname',
        ['extract', 'certname',
          ['select_nodes',
            ['=', 'catalog_environment', 'production']]]],
      ['in', 'certname',
       ['extract', 'certname',
         ['select_fact_contents',
           ['and',
             ['=', 'path', ['foo']],
             ['=', 'value', 'bar']]]]]]);
  return test.done();
};

exports['structured facts with match operator should escape non match parts'] = (test) => {
  test.deepEqual(puppetdbquery.parse('"foo.bar".~".*"=baz'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_fact_contents',
          ['and',
            ['~>', 'path', ['foo\\.bar', '.*']],
            ['=', 'value', 'baz']]]]]);
  return test.done();
};

exports['parse timespec dates'] = (test) => {
  const date = new Date(2014, 8, 9).toISOString();
  test.deepEqual(
    puppetdbquery.parse('#node.report-timestamp<@"Sep 9, 2014"'),
    ['in', 'certname',
      ['extract', 'certname',
        ['select_nodes',
          ['<', 'report-timestamp', date]]]]);
  return test.done();
};

exports['timespec dates parse errors should contain location'] = (test) => {
  try {
    puppetdbquery.parse('foo=@"invalid date"');
  } catch (error) {
    test.equal(error.message,
      'Failed to parse date: "invalid date" at line 1:4 - line 1:19');
  }
  return test.done();
};

exports['handle numbers as numbers'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo=1'),
    ['in', 'certname',
     ['extract', 'certname',
       ['select_fact_contents',
         ['and', ['=', 'path', ['foo']], ['=', 'value', 1]]]]]);
  return test.done();
};

exports['handle booleans as booleans'] = (test) => {
  test.deepEqual(puppetdbquery.parse('foo=false'),
    ['in', 'certname',
     ['extract', 'certname',
       ['select_fact_contents',
         ['and', ['=', 'path', ['foo']], ['=', 'value', false]]]]]);
  return test.done();
};

exports['allow identifiers with ? character'] = (test) => {
  test.deepEqual(puppetdbquery.parse('#event.latest_report?=true'),
    ['in', 'certname',
     ['extract', 'certname',
       ['select_events', ['=', 'latest_report?', true]]]]);
  return test.done();
};
