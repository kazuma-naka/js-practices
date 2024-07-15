import fs from "fs";
import path from "path";

class MyMemo {
  #memosFolderPath;
  constructor() {
    this.#memosFolderPath = "./memos";
  }

  lookUp() {
    const memos = this.#getAllMemos();
    for (const memo of memos) {
      console.log(memo.toString());
    }
  }

  reference() {}

  create(memoInString) {
    const title = this.#getMemoTitle(memoInString);
    fs.writeFile(
      `${this.#memosFolderPath}/${title}.txt`,
      memoInString,
      (err) => {
        if (err) throw err;
      },
    );
  }

  edit() {}

  delete() {}

  #getAllMemos() {
    const memoTitles = [];
    try {
      const files = fs.readdirSync(this.#memosFolderPath);
      for (const file of files) {
        const filePath = path.join(this.#memosFolderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
          const data = fs.readFileSync(filePath, "utf8");
          const memoTitle = this.#getMemoTitle(data);
          memoTitles.push(memoTitle);
        }
      }
      return memoTitles;
    } catch (err) {
      console.error(`ファイルの取得に失敗しました: ` + err);
      return memoTitles;
    }
  }

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
