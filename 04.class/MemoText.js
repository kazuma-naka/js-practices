import fs from "fs";
import path from "path";
import Editor from "./Editor.js";

class MemoText {
  constructor() {
    this.#createDirectory();
  }

  static memosPath = "./memos";

  static all() {
    return fs.readdirSync(MemoText.memosPath);
  }

  content(title) {
    try {
      return fs.readFileSync(this.#path(title), "utf8");
    } catch (err) {
      console.error(`${title} の取得に失敗しました: ` + err);
      return;
    }
  }

  title(memo) {
    return memo.split("\n")[0].replace(/\s+/g, "");
  }

  edit(title) {
    const editor = new Editor();
    editor.launch(this.#path(title));
  }

  delete(title) {
    try {
      fs.unlinkSync(this.#path(title));
      console.log(`${title} を削除しました`);
      return true;
    } catch (err) {
      console.error(`${title} の削除に失敗しました: `, err);
      return false;
    }
  }

  save(title, inputLines) {
    fs.writeFile(this.#path(title), inputLines.join("\n"), (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(`${title}.txt が作成されました。`);
    });
  }

  #createDirectory() {
    if (!fs.existsSync(MemoText.memosPath)) {
      fs.mkdirSync(MemoText.memosPath);
    }
  }

  #path(title) {
    return path.join(MemoText.memosPath, title);
  }

  isValidName(title) {
    const regex = /^[a-zA-Z0-9._-]+$/;
    return regex.test(title);
  }

  hasSame(title) {
    try {
      fs.accessSync(this.#path(title), fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }
}

export default MemoText;
