"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../lib/index.js");
const fs = require("fs");
const chai = require("chai");
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
function readdirAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        });
    });
}
function mkdirAsync(path) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
function existsAsync(path) {
    return new Promise((resolve, reject) => {
        fs.exists(path, exists => resolve(exists));
    });
}
describe("diff check", () => {
    it("should same", async () => {
        const targetdir = "test-resources/diff/target/";
        const outputdir = "test-resources/diff/output/";
        const baselinedir = "test-resources/diff/baseline/";
        if (!existsAsync(outputdir)) {
            mkdirAsync(outputdir);
        }
        for (const testfile of (await readdirAsync(targetdir))) {
            const outputPath = outputdir + testfile;
            const baselinePath = baselinedir + testfile;
            await index_js_1.default(targetdir + testfile, outputPath);
            console.log(await readFileAsync(baselinePath) === await readFileAsync(outputPath));
            chai.assert.strictEqual(await readFileAsync(baselinePath), await readFileAsync(outputPath), "output should be same as baseline");
        }
    });
});
describe("prevent import", () => {
    it("should error out", async () => {
        const errordir = "test-resources/error/";
        for (const testfile of (await readdirAsync(errordir))) {
            try {
                await index_js_1.default(errordir + testfile, "");
            }
            catch (e) {
                continue;
            }
            throw new Error("should be error out but did not");
        }
    });
});
