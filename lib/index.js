"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function readFileAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
function writeFileAsync(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
async function ignore(path, outPath) {
    const content = await readFileAsync(path);
    const array = content.split("\n");
    const ignored = Array.from((function* () {
        for (const line of array) {
            if (line.match(/^import /)) {
                throw new Error("No import statement");
            }
            let result = line.replace(/^export (function|interface|namespace|var|let|const|class) /, '$1 ');
            if (!line.startsWith("export default ")) {
                yield result;
            }
            else {
                line.endsWith('\r') ? yield "\r" : yield "";
            }
        }
    })());
    await writeFileAsync(outPath, ignored.join('\n'));
}
exports.ignore = ignore;
exports.default = ignore;
