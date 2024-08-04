import { execSync } from "child_process";

class Editor {
  launch(memoPath) {
    const editor = process.env.EDITOR;
    if (editor) {
      try {
        execSync(`${editor} ${memoPath}`, {
          stdio: "inherit",
        });
      } catch (error) {
        console.error(`${editor} の起動に失敗しました: ${error.message}`);
      }
    } else {
      console.error("環境変数 EDITOR が設定されていません。");
    }
  }
}

export default Editor;
