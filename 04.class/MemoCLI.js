import readline from "readline";
import enquirer from "enquirer";
import MemoText from "./MemoText.js";
import Editor from "./Editor.js";

class MemoCLI {
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
    const memoText = new MemoText();
    for (const memo of memoText.getAllMemos()) {
      console.log(memo.toString());
    }
  }

  async #reference() {
    let memoText = new MemoText();
    const memos = memoText.getAllMemos();
    if (memos.length === 0) return;
    const referencePrompt = {
      type: "select",
      name: "memo",
      message: "Enter キーでメモを表示",
      choices: memos,
    };
    const response = await enquirer.prompt(referencePrompt);
    memoText = new MemoText(response.memo);
    console.log(memoText.getMemoContent(response.memo));
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
      const memoText = new MemoText();
      const hint = memoText.getMemo(inputLines.join("\n"));
      this.#save(hint, inputLines);
    });
  }

  async #edit() {
    let memoText = new MemoText();
    const memos = memoText.getAllMemos();
    if (memos.length === 0) return;
    const editPrompt = {
      type: "select",
      name: "memo",
      message: "Enter キーでメモを編集",
      choices: memos,
    };
    const response = await enquirer.prompt(editPrompt);
    const editor = new Editor();
    memoText = new MemoText(response.memo);
    editor.launch(memoText.getPath(response.memo));
  }

  async #delete() {
    let memoText = new MemoText();
    const memos = memoText.getAllMemos();
    if (memos.length === 0) return;
    const deletePrompt = {
      type: "select",
      name: "memo",
      message: "Enter キーでメモを削除",
      choices: memos,
    };
    const response = await enquirer.prompt(deletePrompt);
    memoText = new MemoText(response.memo);
    memoText.deleteMemo(response.memo);
  }

  async #save(hint, inputLines) {
    const savePrompt = {
      type: "input",
      name: "memo",
      initial: hint,
    };
    const response = await enquirer.prompt(savePrompt);
    const memoText = new MemoText(response.memo);
    if (!memoText.isValidName(response.memo)) {
      console.log(`${response.memo} は不正な名前です。`);
      return this.#save(hint, inputLines);
    }
    if (memoText.hasSame(response.memo)) {
      console.log(`${response.memo}.txt はすでに存在します。`);
      console.log("別の名前をつけてください。");
      return this.#save(hint, inputLines);
    }
    memoText.saveMemo(response.memo, inputLines);
  }
}

export default MemoCLI;
