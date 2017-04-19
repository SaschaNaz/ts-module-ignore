import ignore from "../lib/index.js";
import * as fs from "fs";
import * as chai from "chai";

function readFileAsync(path: string) {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    });
}

function readdirAsync(path: string) {
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        })
    })
}

function mkdirAsync(path: string) {
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(path, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        })
    })
}

function existsAsync(path: string) {
    return new Promise<boolean>((resolve, reject) => {
        fs.exists(path, exists => resolve(exists))
    })
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
            await ignore(targetdir + testfile, outputPath);
            console.log(await readFileAsync(baselinePath) === await readFileAsync(outputPath))
            chai.assert.strictEqual(await readFileAsync(baselinePath), await readFileAsync(outputPath), "output should be same as baseline");
        }
    })
});

describe("prevent import", () => {
    it("should error out", async () => {
        const errordir = "test-resources/error/";
        for (const testfile of (await readdirAsync(errordir))) {
            try {
                await ignore(errordir + testfile, "");
            }
            catch (e) {
                continue;
            }
            throw new Error("should be error out but did not");
        }
    })
});