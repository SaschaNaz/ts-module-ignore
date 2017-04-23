import ignore from "../lib/index.js";
import * as mz from "mz/fs";
import * as chai from "chai";

describe("diff check", () => {
    it("should same", async () => {
        const targetdir = "test-resources/diff/target/";
        const outputdir = "test-resources/diff/output/";
        const baselinedir = "test-resources/diff/baseline/";
        for (const testfile of (await mz.readdir(targetdir))) {
            const outputPath = outputdir + testfile;
            const baselinePath = baselinedir + testfile;
            await ignore(targetdir + testfile, outputPath);
            chai.assert.strictEqual(await mz.readFile(baselinePath, "utf8"), await mz.readFile(outputPath, "utf8"), "output should be same as baseline");
        }
    })
});

describe("prevent import", () => {
    it("should error out", async () => {
        const errordir = "test-resources/error/";
        for (const testfile of (await mz.readdir(errordir))) {
            try {
                await ignore(errordir + testfile, "");
            }
            catch (e) {
                continue;
            }
            throw new Error("should error out but did not");
        }
    })
});