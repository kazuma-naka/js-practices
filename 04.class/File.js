import path from "path";
import fs from "fs";

class File {
  static memosPath = "./memos";
  constructor(fileName) {
    this.fileName = fileName;
  }

  getPath() {
    return path.join(File.memosPath, this.fileName);
  }

  isValidName() {
    const regex = /^[a-zA-Z0-9._-]+$/;
    return regex.test(this.fileName);
  }

  hasSame() {
    try {
      fs.accessSync(this.getPath(), fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }
}

export default File;
