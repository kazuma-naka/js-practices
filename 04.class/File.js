import path from "path";
import Editor from "./Editor.js";
import fs from "fs";

class File extends Editor {
  memosFolderPath = "./memos";
  getFilePath(fileName) {
    return path.join(this.memosFolderPath, fileName);
  }

  getFilePathWithTxt(fileName) {
    return path.join(this.memosFolderPath, `${fileName}.txt`);
  }

  isValidFileName(fileName) {
    const regex = /^[a-zA-Z0-9._-]+$/;
    return regex.test(fileName);
  }

  hasSameFile(fileName) {
    try {
      fs.accessSync(this.getFilePathWithTxt(fileName), fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }
}

export default File;
