'use strict';

class Rule {
    constructor(tag, ruleObj) {
        if (!tag) throw new Error('tag is required');

        this.rules = [];
        this.tag = tag;

        if (ruleObj) {
            this.parent = ruleObj.parent;
            this.rules = ruleObj.rules || [];
        }
    }

    _getCount($) {
        return $.find(this.getSelector()).length;
    }

    _getInvalidCount($) {
        let count = 0;
        if (this.attrName && this.attrValue) {
            count = $.find(this.tag).not('[' + this.attrName + '=' + '"' + this.attrValue + '"]').length;
        } else if (this.attrName) {
            count = $.find(this.tag).not('[' + this.attrName + ']').length;
        }
        return count;
    }

    getSelector() {
        let selector = this.tag;
        if (this.attrName && this.attrValue) {
            selector += '[' + this.attrName + '=' + '"' + this.attrValue + '"]';
        } else if (this.attrName) {
            selector += '[' + this.attrName + ']';
        }
        return selector;
    }

    getSummarys(dom) {
        let summarys = [];

        let $ = dom('html');
        if (this.parent) {
            $ = $.find(this.parent);
        }

        let parentText = this.parent ? '<' + this.parent + '> tag' : 'This HTML';
        let tagText = ' <' + this.tag + '> tag' + (this.attrName ? ' with ' + this.attrName + ' attribute' + (this.attrValue ? ' and ' + this.attrValue + ' value' : '') : '');

        this.rules.forEach((rule) => {
            let summary;
            if (rule.max || rule.min) {
                let count = this._getCount($);
                if (rule.max && count > rule.max) {
                    summary = parentText + ' have more than ' + rule.max + tagText;
                }

                if (rule.min && count < rule.min) {
                    if (rule.min == 1) {
                        summary = parentText + ' without' + tagText;
                    } else {
                        summary = parentText + ' have less than ' + rule.min + tagText;
                    }
                }
            }

            if (rule.required && this.attrName) {
                let invalidCount = this._getInvalidCount($);
                if (invalidCount > 0) {
                    summary = 'There are ' + invalidCount + ' <' + this.tag + '> tag without ' + this.attrName + ' attribute' + (this.attrValue ? ' with ' + this.attrValue + ' value' : '');
                }
            }

            if (summary) {
                summarys.push(rule.summary || summary);
            }
        });

        return summarys;
    }

    attr(attrName, attrValue) {
        this.attrName = attrName;
        this.attrValue = attrValue;
        return this;
    }

    lessThan(lessThan, summary) {
        if (lessThan >= 1) {
            let rule = { "max": lessThan - 1, "summary": summary };
            this.rules.push(rule);
        }
        return this;
    }

    moreThan(moreThan, summary) {
        if (moreThan >= 0) {
            let rule = { "min": moreThan + 1, "summary": summary };
            this.rules.push(rule);
        }
        return this;
    }

    mustHave(summary) {
        let rule = { "required": true, "summary": summary };
        this.rules.push(rule);
        return this;
    }

    parentNode(parent) {
        this.parent = parent;
        return this;
    }
}

module.exports = Rule