'use strict';

import cheerio from 'cheerio';

const IO = require('./io.js');
const RuleManager = require('./ruleManager.js');

class Detector {
    constructor() {
        this.io = new IO();
        this.ruleManager = new RuleManager();
    }

    _detect() {
        this.result = this.io.read().then(html => this._load(html)).then(dom => this.ruleManager.check(dom)).then(summary => this.io.write(summary));
    }

    _load(html) {
        return new Promise((resolve, reject) => {
            const dom = cheerio.load(html)
            resolve(dom)
        });
    }

    on(result, callback) {
        switch (result) {
            case 'result':
                this.result.then(result => {
                    callback(result)
                });
            case 'error':
                this.result.catch(err => {
                    callback(err);
                });
                break;
            default:
        }
        return this;
    }

    read(input) {
        this.io.input = input;
        return this;
    }

    write(output) {
        this.io.output = output;
        this._detect();
        return this;
    }
}

module.exports = Detector