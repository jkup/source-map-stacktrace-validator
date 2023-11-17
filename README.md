# source-map-stacktrace-validator

Validate source map stacktraces

`node --test testrunners/node.js`

Set up to try out chromium.js testrunner:

1. Run `chrome --headless --remote-debugging-port=9222 localhost:8080` - this runs the headless chrome browser
2. Run `npm run serve` - this serves a simple html page with an example script (find it here: testrunners/chromium-test-setup)
3. Run `node --test testrunners/chromium.js` - runs the actual script with event handlers which should log the browser console error in your terminal console 
