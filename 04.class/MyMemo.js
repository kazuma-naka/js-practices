import fs from "fs";
import File from "./File.js";

class MyMemo extends File {
  createMemoDirectory() {
    if (!fs.existsSync(this.memosFolderPath)) {
      fs.mkdirSync(this.memosFolderPath);
    }
  }

  getAllMemos() {
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

  getMemo(memoInString) {
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

  saveMemo(memo, inputLines) {
    fs.writeFile(
      this.getFilePathWithTxt(memo),
      inputLines.join("\n"),
      (err) => {
        if (err) throw err;
      },
    );
  }
}

export default MyMemo;
