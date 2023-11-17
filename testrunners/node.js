const fs = require("fs");
const path = require("path");

var spawn = require("child_process").spawn;

// Find all the folders inside "testcases"
const directoryPath = path.join(__dirname, "../", "testcases");

const files = fs.readdirSync(directoryPath, { withFileTypes: true });
const folders = files
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

folders.forEach((subdir) => {
  const scriptPath = path.join(directoryPath, subdir, `${subdir}.js`);

  if (fs.existsSync(scriptPath)) {
    var child = spawn("node", ["--enable-source-maps", scriptPath]);

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
          // Error file path
          errorFilePath = match[2];
          foundFilePath = true;
        } else if (match[1]) {
          // Error message line
          errorMessageLine = match[1];
        } else if (
          match[3] &&
          match[4] &&
          !match[4].startsWith("node:internal")
        ) {
          // Stack trace, skipping 'node:internal' paths
          stackTrace.push({ functionName: match[3], functionPath: match[4] });
        }
      }

      console.log("Error File Path:", errorFilePath);
      console.log("Error Message:", errorMessageLine);
      console.log("Stack Trace:", stackTrace);
    });
  }
});
