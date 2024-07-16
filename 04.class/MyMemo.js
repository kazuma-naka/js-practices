import fs from "fs";
import path from "path";
import readline from "readline";
import enquirer from "enquirer";

class MyMemo {
  #memosFolderPath;
  constructor() {
    this.#memosFolderPath = "./memos";
  }

  lookUp() {
    const memos = this.#getAllMemoTitles();
    for (const memo of memos) {
      console.log(memo.toString());
    }
  }

  reference() {
    (async () => {
      const memos = this.#getAllMemoTitles();
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

  create() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    let inputLines = [];

    console.log("メモの本文を入力してください");
    console.log("eof で入力を終了");

    rl.on("line", (input) => {
      if (input.trim().toUpperCase() === "EOF") {
        rl.close();
      } else {
        inputLines.push(input);
      }
    });

    rl.on("close", () => {
      const title = this.#getMemoTitle(inputLines.join("\n"));
      fs.writeFile(
        `${this.#memosFolderPath}/${title}.txt`,
        inputLines.join("\n"),
        (err) => {
          if (err) throw err;
        },
      );
    });
  }

  edit() {}

  delete() {
    (async () => {
      const memos = this.#getAllMemoTitles();
      if (memos.length === 0) return;
      const question = {
        type: "select",
        name: "memoTitle",
        message: "Enter キーでメモを削除",
        choices: memos,
      };
      const answer = await enquirer.prompt(question);
      this.#deleteMemo(answer.memoTitle);
    })();
  }

  createMemoDirectory(){
    if(!fs.existsSync(this.#memosFolderPath)){
      fs.mkdirSync(this.#memosFolderPath)
    }
  }

  #getAllMemoTitles() {
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

  #deleteMemo(fileName) {
    try {
      const filePath = path.join(this.#memosFolderPath, `${fileName}.txt`);
      fs.unlinkSync(filePath);
      console.log(`${fileName} を削除しました`);
    } catch (err) {
      console.error(`${fileName} の削除に失敗しました: `, err);
    }
  }
}

export default MyMemo;
