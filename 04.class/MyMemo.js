import fs from "fs";
import readline from "readline";
import { execSync } from "child_process";
import enquirer from "enquirer";
import FileUtils from "./FileUtils.js";
import AbstractMemo from "./AbstractMemo.js";

class MyMemo extends FileUtils(AbstractMemo) {
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
      fs.writeFile(
        `${this.memosFolderPath}/${title}.txt`,
        inputLines.join("\n"),
        (err) => {
          if (err) throw err;
        },
      );
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

      const editor = process.env.EDITOR;
      const filePath = `${this.memosFolderPath}/${answer.memoTitle}.txt`;

      if (editor) {
        try {
          execSync(`${editor} ${filePath}`, {
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
}

export default MyMemo;
