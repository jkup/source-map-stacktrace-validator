var spawn = require("child_process").spawn;

var child = spawn("node", ["--enable-source-maps", "./test1/authored.js"]);

child.stderr.on("data", function (data) {
  const stringifiedError = data.toString();

  const regex = /^(Error: [^\n]+)|^([^\s].*)|at (\S+) \(([^\)]+)\)/gm;
  let match;
  let errorFilePath,
    errorMessageLine,
    stackTrace = [];
  let foundFilePath = false;

  while ((match = regex.exec(stringifiedError)) !== null) {
    if (!foundFilePath && match[2]) {
      // Rrror file path
      errorFilePath = match[2];
      foundFilePath = true;
    } else if (match[1]) {
      // Rrror message line
      errorMessageLine = match[1];
    } else if (match[3] && match[4] && !match[4].startsWith("node:internal")) {
      // Stack trace, skipping 'node:internal' paths
      stackTrace.push({ functionName: match[3], functionPath: match[4] });
    }
  }

  console.log("Error File Path:", errorFilePath);
  console.log("Error Message:", errorMessageLine);
  console.log("Stack Trace:", stackTrace);
});
