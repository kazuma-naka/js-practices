import fs from "fs";
import Editor from "./Editor.js";
import File from "./File.js";

class MemoText extends File {
  constructor(fileName) {
    super(fileName);
    this.#createMemoDirectory();
  }

  static allMemos() {
    return fs.readdirSync(File.memosPath);
  }

  memoContent() {
    try {
      return fs.readFileSync(this.getPath(), "utf8");
    } catch (err) {
      console.error(`${this.fileName} の取得に失敗しました: ` + err);
      return;
    }
  }

  createHint(memo) {
    return memo.split("\n")[0].replace(/\s+/g, "");
  }

  edit(memo) {
    this.memoText = new MemoText(memo);
    const editor = new Editor();
    editor.launch(this.memoText.getPath());
  }

  delete() {
    try {
      fs.unlinkSync(this.getPath());
      console.log(`${this.fileName} を削除しました`);
      return true;
    } catch (err) {
      console.error(`${this.fileName} の削除に失敗しました: `, err);
      return false;
    }
  }

  save(memo, inputLines) {
    fs.writeFile(this.getPath(), inputLines.join("\n"), (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(`${memo}.txt が作成されました。`);
    });
  }

  #createMemoDirectory() {
    if (!fs.existsSync(File.memosPath)) {
      fs.mkdirSync(File.memosPath);
    }
  }
}

export default MemoText;
