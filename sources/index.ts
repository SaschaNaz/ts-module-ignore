import * as fs from "fs"

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

function writeFileAsync(path: string, content: string) {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path, content, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    })
}

export async function ignore(path: string, outPath: string) {
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

export default ignore;