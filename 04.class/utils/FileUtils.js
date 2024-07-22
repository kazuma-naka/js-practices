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

    getFilePath(fileName) {
      return path.join(this.memosFolderPath, fileName);
    }

    getFilePathWithTxt(fileName) {
      return path.join(this.memosFolderPath, `${fileName}.txt`);
    }

    isValidFileName(fileName) {
      const regex = /^[a-zA-Z0-9._-]+$/;
      return regex.test(fileName);
    }

    hasSameFile(fileName) {
      try {
        fs.accessSync(this.getFilePathWithTxt(fileName), fs.constants.F_OK);
        return true;
      } catch {
        return false;
      }
    }
  };

export default FileUtils;
