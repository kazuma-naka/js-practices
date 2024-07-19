import sqlite3 from "sqlite3";

class BooksDatabase {
  #db;
  #createtableSQL;
  constructor() {
    this.#db = new sqlite3.Database(":memory");
    this.#createtableSQL = `
        CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL UNIQUE
        );
    `;
  }

  create() {
    this.#db.run(this.#createtableSQL, (err) => {
      if (err) return console.error(err);
      console.log("Books のテーブルを作成");
    });
  }

  insert(titleName) {
    const insertSQL = `INSERT INTO books (title) VALUES (?)`;
    this.#db.run(insertSQL, [titleName], function (err) {
      if (err) return console.error(err);
      console.log(`${titleName} が挿入されました。\nrowid: ${this.lastID}`);
    });
  }

  show() {
    const selectSQL = "SELECT id, title FROM books";
    this.#db.each(selectSQL, (err, row) => {
      if (err) console.error(err);
      console.log(`${row.id}: ${row.title}`);
    });
  }

  dropTable() {
    const dropTableSQL = `DROP TABLE IF EXISTS books`;
    this.#db.run(dropTableSQL, (err) => {
      if (err) return console.error(err);
      console.log("テーブルを削除しました。");
    });
  }

  close() {
    this.#db.close((err) => {
      if (err) return console.error(err);
      console.log("データベースをクローズしました。");
    });
  }
}

export default BooksDatabase;
