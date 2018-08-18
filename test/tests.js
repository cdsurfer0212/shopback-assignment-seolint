'use strict';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';

chai.use(chaiAsPromised);
const expect = chai.expect;

const seolint = require('../seolint.js');

describe('read from file, output to file', function () {
    context('when it\'s valid.html', function () {
        it('there should be no defect', function () {
            let expectation = [];
            let result = seolint.detector().read('test/fixture/valid.html').write('dist/test/output/output.html').result;
            return expect(result).to.eventually.deep.equal(expectation);
        });
    });

    context('when it\'s invalid.html', function () {
        it('there should be 7 defects', function () {
            let expectation = [
                'There are 1 <a> tag without rel attribute',
                'This HTML have more than one <h1> tag',
                'There are 1 <img> tag without alt attribute',
                'This HTML without <meta> tag with name attribute and descriptions value',
                'This HTML without <meta> tag with name attribute and keywords value',
                'This HTML have more than 15 <strong> tag',
                '<head> tag without <title> tag'];
            let result = seolint.detector().read('test/fixture/invalid.html').write('dist/test/output/output.html').result;
            return expect(result).to.eventually.deep.equal(expectation);
        });
    });

    context('when it\'s invalid.html, add a new rule', function () {
        it('there should be 8 defects', function () {
            let expectation = [
                'There are 1 <a> tag without rel attribute',
                'This HTML have more than one <h1> tag',
                'There are 1 <img> tag without alt attribute',
                'This HTML without <meta> tag with name attribute and descriptions value',
                'This HTML without <meta> tag with name attribute and keywords value',
                'This HTML have more than 15 <strong> tag',
                '<head> tag without <title> tag',
                'This HTML have more than 2 <a> tag with href attribute'];
            let detector = seolint.detector();
            detector.ruleManager.add(detector.ruleManager.create('a').attr('href').lessThan(3));
            let result = detector.read('test/fixture/invalid.html').write('dist/test/output/output.html').result;
            return expect(result).to.eventually.deep.equal(expectation);
        });
    });

    context('when it\'s invalid.html, add a new rule with custom summary', function () {
        it('there should be 8 defects', function () {
            let expectation = [
                'There are 1 <a> tag without rel attribute',
                'This HTML have more than one <h1> tag',
                'There are 1 <img> tag without alt attribute',
                'This HTML without <meta> tag with name attribute and descriptions value',
                'This HTML without <meta> tag with name attribute and keywords value',
                'This HTML have more than 15 <strong> tag',
                '<head> tag without <title> tag',
                'Be careful'];
            let detector = seolint.detector();
            detector.ruleManager.add(detector.ruleManager.create('a').attr('href').lessThan(3, 'Be careful'));
            let result = detector.read('test/fixture/invalid.html').write('dist/test/output/output.html').result;
            return expect(result).to.eventually.deep.equal(expectation);
        });
    });

    context('when it\'s invalid.html, remove a rule', function () {
        it('there should be 6 defects', function () {
            let expectation = [
                'There are 1 <a> tag without rel attribute',
                'This HTML have more than one <h1> tag',
                'This HTML without <meta> tag with name attribute and descriptions value',
                'This HTML without <meta> tag with name attribute and keywords value',
                'This HTML have more than 15 <strong> tag',
                '<head> tag without <title> tag'];
            let detector = seolint.detector();
            detector.ruleManager.remove('img[alt]');
            let result = detector.read('test/fixture/invalid.html').write('dist/test/output/output.html').result;
            return expect(result).to.eventually.deep.equal(expectation);
        });
    });

    context('when it\'s invalid.html, empty rules', function () {
        it('there should be 6 defects', function () {
            let expectation = [];
            let detector = seolint.detector();
            detector.ruleManager.empty();
            let result = detector.read('test/fixture/invalid.html').write('dist/test/output/output.html').result;
            return expect(result).to.eventually.deep.equal(expectation);
        });
    });
});

describe('read from readable stream, output to writable stream', function () {
    context('when it\'s valid.html', function () {
        it('there should be no defect', function () {
            let expectation = [];
            let result = seolint.detector().read(fs.createReadStream('test/fixture/valid.html')).write(fs.createWriteStream('dist/test/output/output.html')).result;
            return expect(result).to.eventually.deep.equal(expectation);
        });
    });

    context('when it\'s invalid.html', function () {
        it('there should be 7 defects', function () {
            let expectation = [
                'There are 1 <a> tag without rel attribute',
                'This HTML have more than one <h1> tag',
                'There are 1 <img> tag without alt attribute',
                'This HTML without <meta> tag with name attribute and descriptions value',
                'This HTML without <meta> tag with name attribute and keywords value',
                'This HTML have more than 15 <strong> tag',
                '<head> tag without <title> tag'];
            let result = seolint.detector().read(fs.createReadStream('test/fixture/invalid.html')).write(fs.createWriteStream('dist/test/output/output.html')).result;
            return expect(result).to.eventually.deep.equal(expectation);
        });
    });
});

describe('read from readable stream, output to console', function () {
    context('when it\'s valid.html', function () {
        it('there should be no defect', function () {
            let expectation = [];
            let result = seolint.detector().read(fs.createReadStream('test/fixture/valid.html')).write(console).result;
            return expect(result).to.eventually.deep.equal(expectation);
        });
    });

    context('when it\'s invalid.html', function () {
        it('there should be 7 defects', function () {
            let expectation = [
                'There are 1 <a> tag without rel attribute',
                'This HTML have more than one <h1> tag',
                'There are 1 <img> tag without alt attribute',
                'This HTML without <meta> tag with name attribute and descriptions value',
                'This HTML without <meta> tag with name attribute and keywords value',
                'This HTML have more than 15 <strong> tag',
                '<head> tag without <title> tag'];
            let result = seolint.detector().read(fs.createReadStream('test/fixture/invalid.html')).write(console).result;
            return expect(result).to.eventually.deep.equal(expectation);
        });
    });
});