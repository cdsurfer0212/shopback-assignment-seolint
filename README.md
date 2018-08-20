# shopback-assignment-seolint

## Installation

`npm install shopback-assignment-seolint`

## API

### Detect SEO defects

Read from file, write to file

```js
const seolint = require('shopback-assignment-seolint');
seolint.detector().read('test.html').write('output.txt');
```

Read from readable stream, write to writable stream

```js
const fs = require('fs');
const seolint = require('shopback-assignment-seolint');
seolint.detector().read(fs.createReadStream('test.html')).write(fs.createWriteStream('output.txt'));
```

Read from file, write to console

```js
const seolint = require('shopback-assignment-seolint');
seolint.detector().read('test.html').write(console);
```

### Add a new rule

```js
let detector = seolint.detector();
let rule = detector.ruleManager.create('meta').attr('name', 'robots').parentNode('head').moreThan(0);
detector.ruleManager.add(rule);
```

With custom summary

```js
let detector = seolint.detector();
let rule = detector.ruleManager.create('meta').attr('name', 'robots').parentNode('head').moreThan(0, 'Be careful');
detector.ruleManager.add(rule);
```

### Remove a rule

```js
let detector = seolint.detector();
detector.ruleManager.remove('img[alt]');
```

### Empty all rules

```js
let detector = seolint.detector();
detector.ruleManager.empty();
```
