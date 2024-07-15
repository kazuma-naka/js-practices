import fs from "fs";

class MyMemo {
  #memosFolderPath;
  constructor() {
    this.#memosFolderPath = "./memos";
  }

  lookUp() {}

  reference() {}

  create(memoInString) {
    const title = this.#getMemoTitle(memoInString);
    fs.writeFile(`${this.#memosFolderPath}/${title}.txt`, memoInString, (err) => {
      if (err) throw err;
    });
  }

  edit() {}

  delete() {}

  #getMemoTitle(memoInString) {
    if (
      memoInString === "" ||
      memoInString === null ||
      memoInString === undefined ||
      !memoInString.trim()
    ) {
      return "empty_memo";
    } else {
      return memoInString.split("\n")[0].replace(/\s+/g, "");
    }
  }
}

export default MyMemo;
