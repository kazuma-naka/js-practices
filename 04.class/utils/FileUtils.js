import fs from "fs";
import path from "path";

const FileUtils = (Base) =>
  class extends Base {
    memosFolderPath = "./memos";
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
          memoTitles.push(fs.readFileSync(this.getFilePath(file), "utf8"));
        }
        return memoTitles.map((data) => this.getMemoTitle(data));
      } catch (err) {
        console.error(`ファイルの取得に失敗しました: ` + err);
        return memoTitles;
      }
    }

    getMemoContent(fileName) {
      try {
        const data = fs.readFileSync(this.getFilePathWithTxt(fileName), "utf8");
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
        fs.unlinkSync(this.getFilePathWithTxt(fileName));
        console.log(`${fileName} を削除しました`);
      } catch (err) {
        console.error(`${fileName} の削除に失敗しました: `, err);
      }
    }

    getFilePath(fileName) {
      return path.join(this.memosFolderPath, fileName);
    }

    getFilePathWithTxt(fileName) {
      return path.join(this.memosFolderPath, `${fileName}.txt`);
    }
  };

export default FileUtils;
