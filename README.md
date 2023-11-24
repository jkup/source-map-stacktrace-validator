# source-map-stacktrace-validator

Validate source map stacktraces

`node --test testrunners/node.js`

Set up to chrome-remote-interface testrunner:

1. Run `chrome --headless --remote-debugging-port=9222 localhost:8080` - this runs the headless chrome browser
2. Run `npm run serve` - this serves a simple html page with an example script (find it here: testcasesBrowser/simpleThrow)
3. Run `node --test testrunners/chrome-remote-interface.js` - runs the actual script with event handlers which should log the browser console error in your terminal console 

Set up to puppeteer testrunner:

1. Run `npm run serve` - this serves a simple html page with an example script (find it here: testcasesBrowser/simpleThrow)
2. Run `node --test testrunners/puppeteer.js` - runs a test with puppeteer and pasta-sourcemaps to apply function names, unfortunately puppeteer doesn't apply sourcemaps so we should find another solution 