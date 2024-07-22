import MemoCLI from "./MemoCLI.js";

class MyMemo extends MemoCLI {
  constructor() {
    super();
  }
  createCLI() {
    this.createMemoDirectory();
    if (process.argv.length > 2) {
      const argument = process.argv.slice(2)[0];
      if (argument === "-l") this.lookUp();
      else if (argument === "-r") this.reference();
      else if (argument === "-d") this.delete();
      else if (argument === "-e") this.edit();
    } else this.create();
  }
}

export default MyMemo;
