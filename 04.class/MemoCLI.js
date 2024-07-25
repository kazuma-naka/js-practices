import readline from "readline";
import enquirer from "enquirer";
import MemoText from "./MemoText.js";
import Editor from "./Editor.js";

class MemoCLI extends MemoText {
  constructor() {
    super();
  }

  createCLI() {
    this.createMemoDirectory();
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
    for (const memo of this.getAllMemos()) {
      console.log(memo.toString());
    }
  }

  async #reference() {
    const memos = this.getAllMemos();
    if (memos.length === 0) return;
    const referencePrompt = {
      type: "select",
      name: "memo",
      message: "Enter キーでメモを表示",
      choices: memos,
    };
    const response = await enquirer.prompt(referencePrompt);
    console.log(this.getMemoContent(response.memo));
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
      const hint = this.getMemo(inputLines.join("\n"));
      this.#save(hint, inputLines);
    });
  }

  async #edit() {
    const memos = this.getAllMemos();
    if (memos.length === 0) return;
    const editPrompt = {
      type: "select",
      name: "memo",
      message: "Enter キーでメモを編集",
      choices: memos,
    };
    const response = await enquirer.prompt(editPrompt);
    const editor = new Editor();
    editor.launch(this.getFilePath(response.memo))
  }

  async #delete() {
    const memos = this.getAllMemos();
    if (memos.length === 0) return;
    const deletePrompt = {
      type: "select",
      name: "memo",
      message: "Enter キーでメモを削除",
      choices: memos,
    };
    const response = await enquirer.prompt(deletePrompt);
    this.deleteMemo(response.memo);
  }

  async #save(hint, inputLines) {
    const savePrompt = {
      type: "input",
      name: "memo",
      initial: hint,
    };
    const response = await enquirer.prompt(savePrompt);
    if (!this.isValidFileName(response.memo)) {
      console.log(`${response.memo} は不正な名前です。`);
      return this.#save(hint, inputLines);
    }
    if (this.hasSameFile(response.memo)) {
      console.log(`${response.memo}.txt はすでに存在します。`);
      console.log("別の名前をつけてください。");
      return this.#save(hint, inputLines);
    }
    this.saveMemo(response.memo, inputLines);
  }
}

export default MemoCLI;
