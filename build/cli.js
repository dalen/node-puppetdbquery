(function() {
  var err, error, fs, getCommandlineOptions, http, options, opts, puppetdbquery, query, querystring;

  getCommandlineOptions = function() {
    var opts, os;
    os = require('os');
    opts = require('nomnom').script('find-nodes').option('host', {
      abbr: 'H',
      "default": 'puppetdb',
      metavar: 'HOST',
      help: 'PuppetDB host'
    }).option('port', {
      abbr: 'p',
      "default": 8080,
      metavar: 'PORT',
      help: 'PuppetDB port',
      callback: function(port) {
        return parseInt(port);
      }
    }).option('ssl', {
      abbr: 's',
      flag: true,
      "default": false,
      help: 'Use SSL'
    }).option('key', {
      "default": '/etc/puppet/ssl/private_keys/' + os.hostname() + '.pem',
      metavar: 'KEY',
      help: 'Private SSL key file'
    }).option('cert', {
      "default": '/etc/puppet/ssl/certs/' + os.hostname() + '.pem',
      metavar: 'CERT',
      help: 'SSL certificate file'
    }).option('ca', {
      "default": '/etc/puppet/ssl/ca.pem',
      metavar: 'CACERT',
      help: 'SSL CA certificate file'
    }).option('version', {
      abbr: 'v',
      flag: true,
      help: 'print version and exit',
      callback: function() {
        return require('../package.json').version;
      }
    }).option('print', {
      abbr: 'P',
      flag: true,
      "default": false,
      help: 'Print parsed query and exit'
    }).option('query', {
      flag: true,
      required: true,
      position: 0,
      help: 'query string'
    }).parse();
    return opts;
  };

  opts = getCommandlineOptions();

  puppetdbquery = require('../build/main');

  try {
    query = JSON.stringify(puppetdbquery.parse(opts.query));
  } catch (error) {
    err = error;
    console.log(err);
  }

  if (opts.print) {
    console.log(query);
  } else {
    querystring = require('querystring');
    options = {
      host: opts.host,
      port: opts.port,
      path: '/pdb/query/v4/nodes?' + querystring.stringify({
        query: query
      }),
      headers: {
        Accept: 'application/json'
      }
    };
    if (opts.ssl) {
      http = require('https');
      fs = require('fs');
      options.key = fs.readFileSync(opts.key);
      options.cert = fs.readFileSync(opts.cert);
      options.ca = fs.readFileSync(opts.ca);
    } else {
      http = require('http');
    }
    http.get(options, function(res) {
      var data;
      data = '';
      res.on('data', function(chunk) {
        return data += chunk;
      });
      return res.on('end', function() {
        return JSON.parse(data).forEach(function(node) {
          return console.log(node.certname);
        });
      });
    }).on('error', function(e) {
      return console.log("Error fetching from " + opts.host + " : " + opts.port + " " + e);
    });
  }

}).call(this);
