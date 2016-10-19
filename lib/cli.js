#!/usr/bin/env node
/* eslint no-console: "off" */
const os = require('os');
const nomnom = require('nomnom');
const puppetdbquery = require('./main');
const querystring = require('querystring');
const fs = require('fs');
const http = require('http');
const https = require('https');

const getCommandlineOptions = () => {
  const opts = nomnom.script('find-nodes')
    .option('host', {
      abbr: 'H',
      default: 'puppetdb',
      metavar: 'HOST',
      help: 'PuppetDB host',
    })
    .option('port', {
      abbr: 'p',
      default: 8080,
      metavar: 'PORT',
      help: 'PuppetDB port',
      callback(port) {
        return parseInt(port, 10);
      },
    })
    .option('ssl', {
      abbr: 's',
      flag: true,
      default: false,
      help: 'Use SSL',
    })
    .option('key', {
      default: `/etc/puppet/ssl/private_keys/${os.hostname()}.pem`,
      metavar: 'KEY',
      help: 'Private SSL key file',
    })
    .option('cert', {
      default: `/etc/puppet/ssl/certs/${os.hostname()}.pem`,
      metavar: 'CERT',
      help: 'SSL certificate file',
    })
    .option('ca', {
      default: '/etc/puppet/ssl/ca.pem',
      metavar: 'CACERT',
      help: 'SSL CA certificate file',
    })
    .option('version', {
      abbr: 'v',
      flag: true,
      help: 'print version and exit',
      callback() {
        return process.env.npm_package_version;
      },
    })
    .option('print', {
      abbr: 'P',
      flag: true,
      default: false,
      help: 'Print parsed query and exit',
    })
    .option('query', {
      flag: true,
      required: true,
      position: 0,
      help: 'query string',
    })
    .parse();
  return opts;
};

const opts = getCommandlineOptions();
let query;
try {
  query = JSON.stringify(puppetdbquery.parse(opts.query));
} catch (err) {
  console.log(err);
}

// If print option is specified, just print parsed query
// otherwise fire off a query to puppetdb
if (opts.print) {
  console.log(query);
} else {
  const options = {
    host: opts.host,
    port: opts.port,
    path: `/pdb/query/v4/nodes?${querystring.stringify({ query })}`,
    headers: {
      Accept: 'application/json',
    },
  };
  let httplib;
  if (opts.ssl) {
    httplib = https;
    options.key = fs.readFileSync(opts.key);
    options.cert = fs.readFileSync(opts.cert);
    options.ca = fs.readFileSync(opts.ca);
  } else {
    httplib = http;
  }

  // We have the full response, parse it and print the node names
  httplib.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });

    return res.on('end', () =>
      JSON.parse(data).forEach(node => console.log(node.certname))
    );
  })

  .on('error', e => console.log(`Error fetching from ${opts.host} : ${opts.port} ${e}`));
}
