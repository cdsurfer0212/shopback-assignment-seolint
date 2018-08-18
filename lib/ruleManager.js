'use strict';

import fs from 'fs';
import path, { parse } from 'path';
import yaml from 'js-yaml';

const Rule = require('./rule.js');

class RuleManager {
    constructor() {
        this.rules = {};
        if (RuleManager.rulesObj) {
            Object.keys(RuleManager.rulesObj).forEach(async (tag) => {
                let ruleObj = RuleManager.rulesObj[tag];
                let rule = new Rule(tag, ruleObj);
                this.add(rule);
                if (ruleObj.attrs) {
                    Object.keys(ruleObj.attrs).forEach(async (name) => {
                        let attrNameObj = ruleObj.attrs[name];
                        let attrNameRule = new Rule(tag, attrNameObj);
                        attrNameRule.attrName = name;
                        this.add(attrNameRule);
                        if (attrNameObj.values) {
                            Object.keys(attrNameObj.values).forEach(async (value) => {
                                let attrValueObj = attrNameObj.values[value];
                                let attrValueRule = new Rule(tag, attrValueObj);
                                attrValueRule.attrName = name;
                                attrValueRule.attrValue = value;
                                this.add(attrValueRule);
                            });
                        }
                    });
                }
            });
        }
    }

    add(rule) {
        if (rule && rule.rules && rule.rules.length) {
            this.rules[rule.getSelector()] = rule;
        }
    }

    check(dom) {
        return new Promise((resolve, reject) => {
            let summarys = [];
            Object.keys(this.rules).forEach(async (selector) => {
                let subSummarys = this.rules[selector].getSummarys(dom);
                summarys = summarys.concat(subSummarys);
            });
            resolve(summarys);
        });
    }

    create(tag) {
        let rule = new Rule(tag);
        return rule;
    }

    empty() {
        this.rules = {};
    }

    remove(rule) {
        let selector;
        if (rule.constructor.name == 'Rule') {
            selector = rule.getSelector();
        } else if (rule.constructor.name == 'String') {
            selector = rule
        }
        if (selector) {
            delete this.rules[selector];
        }
    }
}

try {
    const filePath = path.resolve(__dirname, '../rules.yml');
    RuleManager.rulesObj = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
} catch (e) {
    console.log(e);
}

module.exports = RuleManager