class Editor {
  getEditorName() {
    const editor = process.env.EDITOR;
    if (editor) {
      return editor;
    } else {
      console.error("環境変数 EDITOR が設定されていません。");
      return;
    }
  }
}

export default Editor;
