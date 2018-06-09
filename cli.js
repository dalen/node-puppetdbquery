#!/usr/bin/env node
/* eslint no-console: "off" */
const os = require("os");
const commander = require("commander");
const puppetdbquery = require("./main");
const querystring = require("querystring");
const fs = require("fs");
const http = require("http");
const https = require("https");

const opts = commander
  .command("find-nodes [options] <query>")
  .option("-H, --host <host>", "PuppetDB host")
  .option("-p, --port <port>", "PuppetDB port", 8080)
  .option("-s, --ssl", "Use SSL")
  .option(
    "--key <keyfile>",
    "Private SSL key file",
    `/etc/puppet/ssl/private_keys/${os.hostname()}.pem`
  )
  .option(
    "--cert <certfile>",
    "SSL certificate file",
    `/etc/puppet/ssl/certs/${os.hostname()}.pem`
  )
  .option("--ca <cafile>", "SSL CA certificate file", "/etc/puppet/ssl/ca.pem")
  .option("-P, --print", "Print parsed query and exit")
  .parse(process.argv);

let query;
try {
  query = JSON.stringify(puppetdbquery.parse(opts.args[0]));
} catch (err) {
  console.log(opts);
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
      Accept: "application/json"
    }
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
  httplib
    .get(options, res => {
      let data = "";
      res.on("data", chunk => {
        data += chunk;
      });

      return res.on("end", () =>
        JSON.parse(data).forEach(node => console.log(node.certname))
      );
    })

    .on("error", e =>
      console.log(`Error fetching from ${opts.host} : ${opts.port} ${e}`)
    );
}
