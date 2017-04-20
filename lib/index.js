"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const mkdirp = require("mkdirp");
const mz = require("mz/fs");
function mkdirpAsync(path) {
    return new Promise((resolve, reject) => {
        mkdirp(path, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
async function ignore(inPath, outPath) {
    const content = await mz.readFile(inPath, "utf8");
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
    const result = ignored.join('\n');
    try {
        await mz.writeFile(outPath, result);
    }
    catch (e) {
        // recommended not to check existence before writeFile
        // but to just catch error trying writeFile
        const dirname = path.dirname(outPath);
        await mkdirpAsync(dirname);
        await mz.writeFile(outPath, result);
    }
}
exports.ignore = ignore;
exports.default = ignore;
