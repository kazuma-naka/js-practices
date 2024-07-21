import fs from "fs";
import path from "path";

class FileUtils {
  #memosFolderPath;
  constructor() {
    this.#memosFolderPath = "./memos";
  }

  createMemoDirectory() {
    if (!fs.existsSync(this.#memosFolderPath)) {
      fs.mkdirSync(this.#memosFolderPath);
    }
  }

  getAllMemoTitles() {
    const memoTitles = [];
    try {
      const files = fs.readdirSync(this.#memosFolderPath);
      for (const file of files) {
        const data = fs.readFileSync(this.#getFilePath(file), "utf8");
        const memoTitle = this.getMemoTitle(data);
        memoTitles.push(memoTitle);
      }
      return memoTitles;
    } catch (err) {
      console.error(`ファイルの取得に失敗しました: ` + err);
      return memoTitles;
    }
  }

  getMemoContent(fileName) {
    try {
      const data = fs.readFileSync(this.#getFilePath(fileName), "utf8");
      return data;
    } catch (err) {
      console.error(`${fileName}.txt の取得に失敗しました: ` + err);
      return "Not Found";
    }
  }

  getMemoTitle(memoInString) {
    if (
      memoInString === "" ||
      memoInString === null ||
      memoInString === undefined ||
      !memoInString.trim()
    ) {
      return "empty_memo";
    } else {
      return memoInString.split("\n")[0].replace(/\s+/g, "");
    }
  }

  deleteMemo(fileName) {
    try {
      fs.unlinkSync(this.#getFilePath(fileName));
      console.log(`${fileName} を削除しました`);
    } catch (err) {
      console.error(`${fileName} の削除に失敗しました: `, err);
    }
  }

  #getFilePath(fileName) {
    return path.join(this.#memosFolderPath, `${fileName}.txt`);
  }
}

export default FileUtils;
