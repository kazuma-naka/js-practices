import readline from "readline";
import enquirer from "enquirer";
import MemoText from "./MemoText.js";

class MemoCLI {
  constructor() {
    this.memoText = new MemoText();
  }

  execute() {
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
    for (const memo of MemoText.all()) {
      console.log(memo.toString());
    }
  }

  async #reference() {
    const prompt = this.#prompt("reference");
    const response = await enquirer.prompt(prompt);
    const content = this.memoText.content(response.title);
    console.log(content);
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
      const title = this.memoText.title(inputLines.join("\n"));
      this.#save(title, inputLines);
    });
  }

  async #edit() {
    const prompt = this.#prompt("edit");
    const response = await enquirer.prompt(prompt);
    this.memoText.edit(response.title);
  }

  async #delete() {
    const prompt = this.#prompt("delete");
    const response = await enquirer.prompt(prompt);
    this.memoText.delete(response.title);
  }

  async #save(head, inputLines) {
    const savePrompt = {
      type: "input",
      name: "title",
      initial: head,
    };
    const response = await enquirer.prompt(savePrompt);
    if (!this.memoText.isValidName(response.title)) {
      console.log(`${response.title} は不正な名前です。`);
      return this.#save(head, inputLines);
    }
    if (this.memoText.hasSame(response.title)) {
      console.log(`${response.title}.txt はすでに存在します。`);
      console.log("別の名前をつけてください。");
      return this.#save(head, inputLines);
    }
    this.memoText.save(response.title, inputLines);
  }

  #prompt(type) {
    const memos = MemoText.all();
    if (memos.length === 0) return;
    const prompt = {
      type: "select",
      name: "title",
      message: this.#promptMessage(type),
      choices: memos,
    };
    return prompt;
  }

  #promptMessage(type) {
    if (type === "reference") {
      return "Enter キーでメモを表示";
    } else if (type === "delete") {
      return "Enter キーでメモを削除";
    } else if (type === "edit") {
      return "Enter キーでメモを編集";
    } else {
      return "";
    }
  }
}

export default MemoCLI;
