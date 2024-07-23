class Editor {
  getName() {
    const editor = process.env.EDITOR;
    if (editor) {
      return editor;
    } else {
      return console.error("環境変数 EDITOR が設定されていません。");
    }
  }
}

export default Editor;
