import Editor from "./Editor.js";
import MemoText from "./MemoText.js";

class MemoRepository {
  constructor(fileName) {
    if (fileName === null || fileName === undefined) {
      this.memoText = new MemoText();
    } else {
      this.memoText = new MemoText(fileName);
    }
  }

  save(memo, inputLines) {
    this.memoText = new MemoText(memo);
    return this.memoText.saveMemo(memo, inputLines);
  }

  delete(memo) {
    this.memoText = new MemoText(memo);
    return this.memoText.deleteMemo();
  }

  edit(memo) {
    this.memoText = new MemoText(memo);
    const editor = new Editor();
    editor.launch(this.memoText.getPath());
  }

  allMemos() {
    return this.memoText.getAllMemos();
  }

  memoContent(memo) {
    this.memoText = new MemoText(memo);
    return this.memoText.getMemoContent(memo);
  }

  createHint(memo) {
    return memo.split("\n")[0].replace(/\s+/g, "");
  }

  isValidName(fileName) {
    this.memoText = new MemoText(fileName);
    return this.memoText.isValidName();
  }

  hasSame(fileName) {
    this.memoText = new MemoText(fileName);
    return this.memoText.hasSame();
  }
}

export default MemoRepository;
