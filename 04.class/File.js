import path from "path";
import fs from "fs";

class File {
  constructor(fileName) {
    this.memosPath = "./memos";
    this.fileName = fileName;
  }

  getPath([,type]) {
    if(type === "txt"){
      return path.join(this.memosPath, `${this.fileName}.txt`);
    }else{
      return path.join(this.memosPath, this.fileName);
    }
  }

  isValidName() {
    const regex = /^[a-zA-Z0-9._-]+$/;
    return regex.test(this.fileName);
  }

  hasSame() {
    try {
      fs.accessSync(this.getPath("txt"), fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }
}

export default File;
