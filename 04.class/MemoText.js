import fs from "fs";
import File from "./File.js";

class MemoText extends File {
  constructor(fileName) {
    super(fileName);
  }

  createMemoDirectory() {
    if (!fs.existsSync(this.memosPath)) {
      fs.mkdirSync(this.memosPath);
    }
  }

  getAllMemos() {
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
      const data = fs.readFileSync(this.getPath(this.fileName), "utf8");
      return data;
    } catch (err) {
      console.error(`${this.fileName}.txt の取得に失敗しました: ` + err);
      return;
    }
  }

  getMemo(memo) {
    return memo.split("\n")[0].replace(/\s+/g, "");
  }

  deleteMemo() {
    try {
      fs.unlinkSync(this.getPath(this.fileName));
      console.log(`${this.fileName} を削除しました`);
      return true;
    } catch (err) {
      console.error(`${this.fileName} の削除に失敗しました: `, err);
      return false;
    }
  }

  saveMemo(memo, inputLines) {
    fs.writeFile(this.getPathWithTxt(memo), inputLines.join("\n"), (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(`${memo}.txt が作成されました。`);
    });
  }
}

export default MemoText;
