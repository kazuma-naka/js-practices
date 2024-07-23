import fs from "fs";
import readline from "readline";
import { execSync } from "child_process";
import enquirer from "enquirer";
import MyMemo from "./MyMemo.js";

class MemoCLI extends MyMemo {
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

  lookUp() {
    for (const memo of this.getAllMemoTitles()) {
      console.log(memo.toString());
    }
  }

  reference() {
    (async () => {
      const memos = this.getAllMemoTitles();
      if (memos.length === 0) return;
      const referencePrompt = {
        type: "select",
        name: "memoTitle",
        message: "Enter キーでメモを表示",
        choices: memos,
      };
      const response = await enquirer.prompt(referencePrompt);
      console.log(this.getMemoContent(response.memoTitle));
    })();
  }

  create() {
    let inputLines = [];
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("メモの本文を入力してください");
    console.log("eof で入力を終了");

    rl.on("line", (input) => {
      if (input.trim().toUpperCase() === "EOF") rl.close();
      else inputLines.push(input);
    });

    rl.on("close", () => {
      const hintString = this.getMemoTitle(inputLines.join("\n"));
      this.save(hintString, inputLines);
    });
  }

  edit() {
    (async () => {
      const memos = this.getAllMemoTitles();
      if (memos.length === 0) return;
      const editPrompt = {
        type: "select",
        name: "memoTitle",
        message: "Enter キーでメモを編集",
        choices: memos,
      };
      const response = await enquirer.prompt(editPrompt);
      const editor = this.getEditorName();

      if (editor) {
        try {
          execSync(`${editor} ${this.getFilePath(response.memoTitle)}`, {
            stdio: "inherit",
          });
        } catch (error) {
          console.error(`${editor} の起動に失敗しました: ${error.message}`);
        }
      } else console.error("環境変数 EDITOR が設定されていません。");
    })();
  }

  delete() {
    (async () => {
      const memos = this.getAllMemoTitles();
      if (memos.length === 0) return;
      const deletePrompt = {
        type: "select",
        name: "memoTitle",
        message: "Enter キーでメモを削除",
        choices: memos,
      };
      const response = await enquirer.prompt(deletePrompt);
      this.deleteMemo(response.memoTitle);
    })();
  }

  save(hintString, inputLines) {
    (async () => {
      const savePrompt = {
        type: "input",
        name: "memoTitle",
        message: "",
        initial: hintString,
      };
      const response = await enquirer.prompt(savePrompt);
      if (this.isValidFileName(response.memoTitle)) {
        if (this.hasSameFile(response.memoTitle)) {
          console.log(
            `${response.memoTitle}.txt はすでに存在します。\n別の名前をつけてください。`,
          );
          return this.save(hintString, inputLines);
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
        return this.save(hintString, inputLines);
      }
    })();
  }
}

export default MemoCLI;
