import readline from "readline";
import enquirer from "enquirer";
import MemoText from "./MemoText.js";
import Editor from "./Editor.js";

class MemoCLI {
  constructor() {
    this.memoText = new MemoText();
  }

  create() {
    if (process.argv.length > 2) {
      const argument = process.argv.slice(2)[0];
      if (argument === "-l") {
        this.#lookUp();
      } else if (argument === "-r") {
        this.#reference();
      } else if (argument === "-d") {
        this.#delete();
      } else if (argument === "-e") {
        this.#edit();
      }
    } else {
      this.#create();
    }
  }

  #lookUp() {
    for (const memo of this.memoText.getAllMemos()) {
      console.log(memo.toString());
    }
  }

  async #reference() {
    const memos = this.memoText.getAllMemos();
    if (memos.length === 0) return;
    const referencePrompt = {
      type: "select",
      name: "memo",
      message: "Enter キーでメモを表示",
      choices: memos,
    };
    const response = await enquirer.prompt(referencePrompt);
    this.memoText = new MemoText(response.memo);
    console.log(this.memoText.getMemoContent(response.memo));
  }

  #create() {
    let inputLines = [];
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

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
      const hint = this.memoText.getMemo(inputLines.join("\n"));
      this.#save(hint, inputLines);
    });
  }

  async #edit() {
    const memos = this.memoText.getAllMemos();
    if (memos.length === 0) return;
    const editPrompt = {
      type: "select",
      name: "memo",
      message: "Enter キーでメモを編集",
      choices: memos,
    };
    const response = await enquirer.prompt(editPrompt);
    const editor = new Editor();
    this.memoText = new MemoText(response.memo);
    editor.launch(this.memoText.getPath(response.memo));
  }

  async #delete() {
    const memos = this.memoText.getAllMemos();
    if (memos.length === 0) return;
    const deletePrompt = {
      type: "select",
      name: "memo",
      message: "Enter キーでメモを削除",
      choices: memos,
    };
    const response = await enquirer.prompt(deletePrompt);
    this.memoText = new MemoText(response.memo);
    this.memoText.deleteMemo(response.memo);
  }

  async #save(hint, inputLines) {
    const savePrompt = {
      type: "input",
      name: "memo",
      initial: hint,
    };
    const response = await enquirer.prompt(savePrompt);
    this.memoText = new MemoText(response.memo);
    if (!this.memoText.isValidName(response.memo)) {
      console.log(`${response.memo} は不正な名前です。`);
      return this.#save(hint, inputLines);
    }
    if (this.memoText.hasSame(response.memo)) {
      console.log(`${response.memo}.txt はすでに存在します。`);
      console.log("別の名前をつけてください。");
      return this.#save(hint, inputLines);
    }
    this.memoText.saveMemo(response.memo, inputLines);
  }
}

export default MemoCLI;
