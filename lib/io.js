'use strict';

import fs from 'fs';
import path from 'path';

class IO {
    constructor() {
    }

    _checkDirectory(directory) {
        try {
            fs.statSync(directory);
        } catch (e) {
            fs.mkdirSync(directory);
        }
    }

    read() {
        return new Promise((resolve, reject) => {
            const type = this.input.constructor.name;
            switch (type) {
                case 'String':
                    const filePath = this.input;
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) throw err;
                        resolve(data);
                    });
                    break;
                case 'ReadStream':
                    const readStream = this.input;
                    let data = '';
                    readStream.on('data', (chunk) => {
                        data += chunk;
                    });
                    readStream.on('end', () => {
                        resolve(data);
                    });
                    readStream.on('error', (err) => {
                        throw err;
                    });
                    break;
                default:
            }
        });
    }

    write(summarys) {
        return new Promise((resolve, reject) => {
            resolve(summarys);

            let summary = '';
            if (summarys && summarys.length > 0) {
                summary = summarys.length + ' SEO defects found: \n' + summarys.join('\n') + '\n';
            } else {
                summary = 'No any SEO defect found. \n';
            }

            const type = this.output.constructor.name;
            switch (type) {
                case 'String':
                    const filePath = this.output;
                    this._checkDirectory(path.dirname(filePath));
                    fs.writeFile(filePath, summary, (err) => {
                        if (err) throw err;
                    });
                    break;
                case 'WriteStream':
                    const writeStream = this.output;
                    writeStream.write(summary, (err) => {
                        if (err) throw err;
                    })
                    writeStream.on('error', (err) => {
                        throw err;
                    })
                    break;
                case 'Console':
                default:
                    console.log(summary);
            }
        });
    }
}

module.exports = IO