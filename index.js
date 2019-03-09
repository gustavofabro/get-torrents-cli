#!/usr/bin/env node

'use-strict'

const program = require('commander')
const pkg = require('./package.json')
const delegator = require('./app/delegator')
const terminalLink = require('terminal-link')

let getTorrents = (data, options) => {
    delegator.extractTorrents(data)
        .then(data => {
            if (!data.urls.length) {
                console.log('No data found');
                return;
            }

            data.urls.forEach(item => {
                let link = terminalLink(item.name, item.uri);

                console.log(link)
                console.log('-'.repeat(10));
            });
        })
        .catch(err => console.log(err))
}

program
    .arguments('<data>')
    .action(getTorrents)
    .version(pkg.version)

program.parse(process.argv)

if (process.argv.length < 3) {
    program.help()
}