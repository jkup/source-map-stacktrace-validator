var spawn = require("child_process").spawn;

var child = spawn("node", ["--enable-source-maps", "./test1/authored.js"]);

child.stderr.on("data", function (data) {
  // parse error
  console.log(data.toString());
});

child.on("close", function (code, signal) {
  // process exited and no more data available on `stdout`/`stderr`
});
