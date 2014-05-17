#!/usr/bin/env node

function getCommandlineOptions() {
  "use strict";
  var os = require('os');
  var opts = require("nomnom").script('find-nodes').option('host', {
    abbr : 'h',
    'default' : 'puppetdb',
    metavar : 'HOST',
    help : 'PuppetDB host'
  }).option('port', {
    abbr : 'p',
    'default' : 8080,
    metavar : 'PORT',
    help : 'PuppetDB port',
    callback : function(port) {
      if (port != parseInt(port))
        return "port must be a number";
    }
  }).option('ssl', {
    abbr : 's',
    flag : true,
    'default' : false,
    help : 'Use SSL'
  }).option('key', {
    'default' : '/etc/puppet/ssl/private_keys/' + os.hostname() + '.pem',
    metavar : 'KEY',
    help : 'Private SSL key file'
  }).option('cert', {
    'default' : '/etc/puppet/ssl/certs/' + os.hostname() + '.pem',
    metavar : 'CERT',
    help : 'SSL certificate file'
  }).option('ca', {
    'default' : '/etc/puppet/ssl/ca.pem',
    metavar : 'CACERT',
    help : 'SSL CA certificate file'
  }).option('version', {
    abbr : 'v',
    flag : true,
    help : 'print version and exit',
    callback : function() {
      return require('../package.json').version;
    }
  }).option('print', {
    abbr : 'P',
    flag : true,
    'default' : false,
    help : 'Print parsed query and exit'
  }).option('query', {
    flag : true,
    required : true,
    position : 0,
    help : 'query string'
  }).parse();

  return opts;
}

var opts = getCommandlineOptions();

var puppetdbquery = require('./puppetdbquery');
try {
  var parser = puppetdbquery.parser;
  // We want to parse for the nodes endpoint so set nodeQuery to true
  parser.yy.nodeQuery = true;
  var query = JSON.stringify(parser.parse(opts.query));
} catch (err) {
  console.log(err);
}

// If print option is specified, just print parsed query
// otherwise fire off a query to puppetdb
if (opts.print) {
  console.log(query);
} else {
  var querystring = require('querystring');
  var options = {
    host : opts.host,
    port : opts.port,
    path : '/v3/nodes?' + querystring.stringify({
      query : query
    }),
    headers : {
      'Accept' : 'application/json'
    }
  };
  if (opts.ssl) {
    var http = require('https');
    options.key = fs.readFileSync(opts.key);
    options.cert = fs.readFileSync(opts.cert);
    options.ca = fs.readFileSync(opts.ca);
  } else {
    var http = require('http');
  }
  http.get(options, function(res) {
    var data = "";
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      // We have the full response, parse it and print the node names
      JSON.parse(data).forEach(function(node) {
        console.log(node.name);
      });
    });
  }).on('error', function(e) {
    console.log('Error fetching from ' + opts.host + ':' + opts.port + ' '
      + e);
    });
}
