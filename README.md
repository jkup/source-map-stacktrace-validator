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

### Next steps 
As a part of research into browser debuggers we found out that devtools-frontend applies the sourcemaps in chrome and there is no external API we could hook up to in order to test the sourcemaps stacktrace. So a next step would be to include a test harness as an npm package in the debuggers themselves and run the tests there. 

That's where these instructions can come handy for further development of the test harness for sourcemaps validator.

#### Helper [instructions](https://gist.github.com/abelkius/b4e11d5099594176f050d5f6bb8362f7) for devtools-frontend which allow you to:
- install the prerequisites
- get the repo
- build
- add an npm package
- run e2e sourcemaps tests



