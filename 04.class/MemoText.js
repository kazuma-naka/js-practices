import fs from "fs";
import path from "path";
import Editor from "./Editor.js";

class MemoText {
  constructor(fileName) {
    this.#createDirectory();
    this.fileName = fileName;
  }

  static memosPath = "./memos";

  static all() {
    return fs.readdirSync(MemoText.memosPath);
  }

  content() {
    try {
      return fs.readFileSync(this.path(), "utf8");
    } catch (err) {
      console.error(`${this.fileName} の取得に失敗しました: ` + err);
      return;
    }
  }

  title(memo) {
    return memo.split("\n")[0].replace(/\s+/g, "");
  }

  edit(memo) {
    this.memoText = new MemoText(memo);
    const editor = new Editor();
    editor.launch(this.memoText.path());
  }

  delete() {
    try {
      fs.unlinkSync(this.path());
      console.log(`${this.fileName} を削除しました`);
      return true;
    } catch (err) {
      console.error(`${this.fileName} の削除に失敗しました: `, err);
      return false;
    }
  }

  save(memo, inputLines) {
    fs.writeFile(this.path(), inputLines.join("\n"), (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(`${memo}.txt が作成されました。`);
    });
  }

  #createDirectory() {
    if (!fs.existsSync(MemoText.memosPath)) {
      fs.mkdirSync(MemoText.memosPath);
    }
  }

  path() {
    return path.join(MemoText.memosPath, this.fileName);
  }

  isValidName() {
    const regex = /^[a-zA-Z0-9._-]+$/;
    return regex.test(this.fileName);
  }

  hasSame() {
    try {
      fs.accessSync(this.path(), fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }
}

export default MemoText;
