import fs from "fs";
import File from "./File.js";

class MemoText extends File {
  constructor(fileName) {
    super(fileName);
    this.#createMemoDirectory();
  }

  static getAllMemos() {
    return fs.readdirSync(File.memosPath);
  }

  getMemoContent() {
    try {
      return fs.readFileSync(this.getPath(), "utf8");
    } catch (err) {
      console.error(`${this.fileName} の取得に失敗しました: ` + err);
      return;
    }
  }

  deleteMemo() {
    try {
      fs.unlinkSync(this.getPath());
      console.log(`${this.fileName} を削除しました`);
      return true;
    } catch (err) {
      console.error(`${this.fileName} の削除に失敗しました: `, err);
      return false;
    }
  }

  saveMemo(memo, inputLines) {
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
