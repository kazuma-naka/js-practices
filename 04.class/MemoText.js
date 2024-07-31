import fs from "fs";
import File from "./File.js";

class MemoText extends File {
  constructor(fileName) {
    super(fileName);
    this.#createMemoDirectory();
  }

  static getAllMemos() {
    const memoTitles = [];
    try {
      const files = fs.readdirSync(this.memosPath);
      for (const file of files) {
        memoTitles.push(file);
      }
      return memoTitles;
    } catch (err) {
      console.error(`ファイルの取得に失敗しました: ` + err);
      return memoTitles;
    }
  }

  getMemoContent() {
    try {
      return fs.readFileSync(this.getPath(), "utf8");
    } catch (err) {
      console.error(`${this.fileName}.txt の取得に失敗しました: ` + err);
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
    fs.writeFile(this.getPath("txt"), inputLines.join("\n"), (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(`${memo}.txt が作成されました。`);
    });
  }

  #createMemoDirectory() {
    if (!fs.existsSync(this.memosPath)) {
      fs.mkdirSync(this.memosPath);
    }
  }
}

export default MemoText;
