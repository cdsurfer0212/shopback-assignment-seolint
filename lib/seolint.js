'use strict';

const Detector = require('./detector.js');

class SEOLint {
    static detector() {
        return new Detector();
    }
}

module.exports = SEOLint