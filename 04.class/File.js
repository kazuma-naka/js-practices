import path from "path";
import fs from "fs";

class File {
  constructor(fileName) {
    this.memosPath = "./memos";
    this.fileName = fileName;
  }

  getPath() {
    return path.join(this.memosPath, this.fileName);
  }

  getPathWithTxt() {
    return path.join(this.memosPath, `${this.fileName}.txt`);
  }

  isValidName() {
    const regex = /^[a-zA-Z0-9._-]+$/;
    return regex.test(this.fileNamefileName);
  }

  hasSame() {
    try {
      fs.accessSync(
        this.getPathWithTxt(this.fileNamefileName),
        fs.constants.F_OK,
      );
      return true;
    } catch {
      return false;
    }
  }
}

export default File;
