import fs from "fs";
import readline from "readline";
import { execSync } from "child_process";
import enquirer from "enquirer";
import FileUtils from "./utils/FileUtils.js";
import AbstractMemo from "./AbstractMemo.js";
import EditorUtils from "./utils/EditorUtil.js";

class MyMemo extends EditorUtils(FileUtils(AbstractMemo)) {
  constructor() {
    super();
  }

  lookUp() {
    const memos = this.getAllMemoTitles();
    for (const memo of memos) {
      console.log(memo.toString());
    }
  }

  reference() {
    (async () => {
      const memos = this.getAllMemoTitles();
      if (memos.length === 0) return;
      const question = {
        type: "select",
        name: "memoTitle",
        message: "Enter キーでメモを表示",
        choices: memos,
      };
      const answer = await enquirer.prompt(question);
      console.log(this.getMemoContent(answer.memoTitle));
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
      const title = this.getMemoTitle(inputLines.join("\n"));
      this.save(title, inputLines);
    });
  }

  edit() {
    (async () => {
      const memos = this.getAllMemoTitles();
      if (memos.length === 0) return;
      const question = {
        type: "select",
        name: "memoTitle",
        message: "Enter キーでメモを編集",
        choices: memos,
      };
      const answer = await enquirer.prompt(question);
      const editor = this.getEditorName();

      if (editor) {
        try {
          execSync(`${editor} ${this.getFilePathWithTxt(answer.memoTitle)}`, {
            stdio: "inherit",
          });
        } catch (error) {
          console.error(`${editor} の起動に失敗しました: ${error.message}`);
        }
      } else {
        console.error("環境変数 EDITOR が設定されていません。");
      }
    })();
  }

  delete() {
    (async () => {
      const memos = this.getAllMemoTitles();
      if (memos.length === 0) return;
      const question = {
        type: "select",
        name: "memoTitle",
        message: "Enter キーでメモを削除",
        choices: memos,
      };
      const answer = await enquirer.prompt(question);
      this.deleteMemo(answer.memoTitle);
    })();
  }

  save(firstLineString, inputLines) {
    (async () => {
      const memoTitlePrompt = {
        type: "input",
        name: "memoTitle",
        message: "",
        initial: firstLineString,
      };
      const response = await enquirer.prompt(memoTitlePrompt);
      if (this.isValidFileName(response.memoTitle)) {
        if (this.hasSameFile(response.memoTitle)) {
          console.log(`${response.memoTitle}.txt はすでに存在します。\n別の名前をつけてください。`);
          return this.save(firstLineString, inputLines);
        }
        fs.writeFile(
          this.getFilePathWithTxt(response.memoTitle),
          inputLines.join("\n"),
          (err) => {
            if (err) throw err;
          },
        );
        console.log(`${response.memoTitle}.txt が作成されました。`);
      } else {
        console.log(`${response.memoTitle} は不正な名前です。`);
        return this.save(firstLineString, inputLines);
      }
    })();
  }
}

export default MyMemo;
