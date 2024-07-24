import fs from "fs";
import File from "./File.js";

class MemoText extends File {
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
      console.error(`${fileName}.txt の取得に失敗しました: ` + err);
      return;
    }
  }

  getMemo(memo) {
    return memo.split("\n")[0].replace(/\s+/g, "");
  }

  deleteMemo(fileName) {
    try {
      fs.unlinkSync(this.getFilePath(fileName));
      console.log(`${fileName} を削除しました`);
      return true;
    } catch (err) {
      console.error(`${fileName} の削除に失敗しました: `, err);
      return false;
    }
  }

  saveMemo(memo, inputLines) {
    fs.writeFile(
      this.getFilePathWithTxt(memo),
      inputLines.join("\n"),
      (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log(`${memo}.txt が作成されました。`);
      },
    );
  }
}

export default MemoText;
