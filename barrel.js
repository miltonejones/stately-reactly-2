const fs = require("fs");
const path = require("path");

function listFilesInUtilDirectory() {
  const utilDirPath = "src/styled"; // path.join(__dirname, "util");
  const fileNames = fs.readdirSync(utilDirPath);
  const fileObject = {};

  const imp = [];

  fileNames.forEach((fileName) => {
    const filePath = path.join(utilDirPath, fileName);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isFile()) {
      const fileBasename = path.basename(fileName, path.extname(fileName));
      fileObject[fileBasename] = fileName;
      imp.push(`import ${fileBasename} from "./${fileBasename}"; `);
    }
  });
  console.log(imp.join("\n"));
  console.log(fileObject);
  return fileObject;
}
listFilesInUtilDirectory();
