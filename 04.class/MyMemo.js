import fs from "fs";
import File from "./File.js";

class MyMemo extends File {
  createMemoDirectory() {
    if (!fs.existsSync(this.memosFolderPath)) {
      fs.mkdirSync(this.memosFolderPath);
    }
  }

  getAllMemoTitles() {
    const memoTitles = [];
    try {
      const files = fs.readdirSync(this.memosFolderPath);
      for (const file of files) {
        memoTitles.push(file);
      }
      return memoTitles;
    } catch (err) {
      console.error(`ファイルの取得に失敗しました: ` + err);
      return memoTitles;
    }
  }

  getMemoContent(fileName) {
    try {
      const data = fs.readFileSync(this.getFilePath(fileName), "utf8");
      return data;
    } catch (err) {
      return console.error(`${fileName}.txt の取得に失敗しました: ` + err);
    }
  }

  getMemoTitle(memoInString) {
    return memoInString.split("\n")[0].replace(/\s+/g, "");
  }

  deleteMemo(fileName) {
    try {
      fs.unlinkSync(this.getFilePath(fileName));
      console.log(`${fileName} を削除しました`);
    } catch (err) {
      console.error(`${fileName} の削除に失敗しました: `, err);
    }
  }
}

export default MyMemo;
