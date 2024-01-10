const fs = require("fs");
const puppeteer = require('puppeteer');
const pasta = require('@bloomberg/pasta-sourcemaps');
const assert = require("node:assert");
const { test } = require("node:test");

const mapFileName = 'testcases/simpleThrow/simpleThrow.js.map';
const sourceFileName = 'webpack://sourcemaps-playground/./src/index.js';

// TODO: make it generic for multiple testcases
function getPastaSourceMap() {
    const sourceMapFile = fs.readFileSync(mapFileName, 'utf-8');
    const sourceMap = JSON.parse(sourceMapFile);

    const fileFuncDesc = new Map([]);

    sourceMap.sources.map((source, index) =>  {
        const sourceContent = sourceMap.sourcesContent[index];
        // until browsers implement the function names mapping in stacktrace, use pasta-sourcemaps
        const funcDescs = pasta.parse(sourceContent, "ECMAScript");
        fileFuncDesc.set(source, funcDescs);
    });

    return pasta.encode(sourceMap, fileFuncDesc);
}

function parseStackLines(stack) {
    const regex = /\/([A-Za-z0-9\.]*)\:([0-9]*)\:([0-9]*)\)/;
    const stackLines = stack.split('\n');
    return stackLines
        .map((line) => line.trim())
        .map((line) => {
            if (line.startsWith('at ')) {
                const match = line.match(regex);
                return {
                    usePasta: true,
                    original: line,
                    file: match[1],
                    line: match[2],
                    position: match[3]
                };
            } 
            return {
                usePasta: false,
                original: line
            };
        });
}

const expectedLines = [
    'Error: something went wrong',
    'at wat (http://127.0.0.1:8080/simpleThrow.js:1:19)',
    'at wat (http://127.0.0.1:8080/simpleThrow.js:1:53)'
];

test('test browser stacktrace', async () => {
    const browser = await puppeteer.launch();
    const pastaSourceMap = getPastaSourceMap();
    const decoder = new pasta.SourceMapDecoder(pastaSourceMap);
    
    const page = await browser.newPage();

    page.on('pageerror', error => {
        const traces = parseStackLines(error.stack);
        const outputLines = traces.map((trace) => {
            if (trace.usePasta) {
                // TODO: we don't have the file name because puppeteer doesn't apply sourcemaps
                // we need to figure out a different approach where we can check for applied sourcemaps
                const fnName = decoder.decode(sourceFileName, trace.line, trace.position);
                return trace.original.replace('<anonymous>', fnName);
            }
            return trace.original;
        });

        outputLines.forEach((output, index) => assert(output, expectedLines[index]));
    });

    await page.goto('http://127.0.0.1:8080');

    await browser.close();
});
