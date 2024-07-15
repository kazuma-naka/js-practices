import fs from "fs";
import path from "path";
import enquirer from "enquirer";

class MyMemo {
  #memosFolderPath;
  constructor() {
    this.#memosFolderPath = "./memos";
  }

  lookUp() {
    const memos = this.#getMemoTitles();
    for (const memo of memos) {
      console.log(memo.toString());
    }
  }

  reference() {
    (async () => {
      const memos = this.#getMemoTitles();
      if (memos.length === 0) return;
      const question = {
        type: "select",
        name: "memoTitle",
        message: "Enter キーでメモを表示",
        choices: memos,
      };
      const answer = await enquirer.prompt(question);
      console.log(`${this.#getMemoContent(answer.memoTitle)}`);
    })();
  }

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

  #getMemoTitles() {
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

  #getMemoContent(fileName) {
    try {
      const filePath = path.join(this.#memosFolderPath, `${fileName}.txt`);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        const data = fs.readFileSync(filePath, "utf8");
        return data;
      }
    } catch (err) {
      console.error(`${fileName}.txt の取得に失敗しました: ` + err);
      return "Not Found";
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
