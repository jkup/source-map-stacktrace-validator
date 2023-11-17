const CDP = require('chrome-remote-interface');

// trying chrome-remote-interface to get headless chrome browser stacktrace
async function test() {
    let client;
    try {
        client = await CDP();
        const {Network, Page, Runtime, Log} = client;
        Network.requestWillBeSent((params) => {
            console.log(params.request.url);
        });

        Runtime.exceptionThrown(({exceptionDetails, }) => {
            /** this is the only event which has some output, but it is in form of an object, like so:
                type: 'object',
                subtype: 'error',
                className: 'Error',
                description: 'Error: something went wrong\n' +
                '    at http://127.0.0.1:8080/simpleThrow.js:1:19\n' +
                '    at http://127.0.0.1:8080/simpleThrow.js:1:53',
                objectId: '4003434955140567295.4.1'
            **/
            console.log(exceptionDetails);
        });

        Runtime.consoleAPICalled(({logType, args}) => {
            // this doesn't seem to log anything
            // it's only for console.* invocations
            console.log(logType, args);
        });

        Log.entryAdded((arg) => {
            // this doesn't seem to log anything either
            console.log(arg);
        });

        Page.loadEventFired(() => {
            console.log("Test page successfully loaded");
        });

        await Page.navigate({url: 'http://127.0.0.1:8080'});

        // enables domain for event listeners used above
        await Network.enable();
        await Page.enable();
        await Runtime.enable()
        await Log.enable();
        await Page.loadEventFired();
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

test();