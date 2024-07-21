#! /usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

const database = new sqlite3.Database(":memory:");
const createtableSQL = `
        CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL UNIQUE
        );
    `;

const insertSQL = `INSERT INTO books (title) VALUES (?)`;
const selectSQL = "SELECT id, title FROM books";
const dropTableSQL = `DROP TABLE IF EXISTS books`;
const insertSQLError = `INSERT INTO boooks (title) VALUES (?)`;
const selectSQLError = "SELECT id, tile FROM books";
const titleNames = [
  "To Kill a Mockingbird",
  "1984",
  "The Great Gatsby",
  "Pride and Prejudice",
  "The Catcher in the Rye",
];

/* callback start */
database.run(createtableSQL, (err) => {
  if (err) return console.error(err);
  console.log("Books のテーブルを作成");
  database.run(insertSQL, [titleNames[0]], function (err) {
    if (err) return console.error(err);
    console.log(`${titleNames[0]} が挿入されました。\nrowid: ${this.lastID}`);
    database.run(insertSQL, [titleNames[1]], function (err) {
      if (err) return console.error(err);
      console.log(`${titleNames[1]} が挿入されました。\nrowid: ${this.lastID}`);
      database.run(insertSQL, [titleNames[2]], function (err) {
        if (err) return console.error(err);
        console.log(
          `${titleNames[2]} が挿入されました。\nrowid: ${this.lastID}`,
        );
        database.run(insertSQL, [titleNames[3]], function (err) {
          if (err) return console.error(err);
          console.log(
            `${titleNames[3]} が挿入されました。\nrowid: ${this.lastID}`,
          );
          database.run(insertSQL, [titleNames[4]], function (err) {
            if (err) return console.error(err);
            console.log(
              `${titleNames[4]} が挿入されました。\nrowid: ${this.lastID}`,
            );
            database.each(
              selectSQL,
              (err, row) => {
                if (err) return console.error(err);
                console.log(`${row.id}: ${row.title}`);
              },
              (err) => {
                if (err) return console.error(err);
                database.run(dropTableSQL, (err) => {
                  if (err) return console.error(err);
                  console.log("テーブルを削除しました。");
                });
              },
            );
          });
        });
      });
    });
  });
});

await timers.setTimeout(2500);

/* callback with error start */
try {
  database.run(createtableSQL, (err) => {
    if (err) return console.error(err);
    console.log("Books のテーブルを作成");
    database.run(insertSQLError, [titleNames[0]], function (err) {
      if (err) return console.error(err);
      console.log(`${titleNames[0]} が挿入されました。\nrowid: ${this.lastID}`);
      database.run(insertSQLError, [titleNames[1]], function (err) {
        if (err) return console.error(err);
        console.log(
          `${titleNames[1]} が挿入されました。\nrowid: ${this.lastID}`,
        );
        database.run(insertSQLError, [titleNames[2]], function (err) {
          if (err) return console.error(err);
          console.log(
            `${titleNames[2]} が挿入されました。\nrowid: ${this.lastID}`,
          );
          database.run(insertSQLError, [titleNames[3]], function (err) {
            if (err) return console.error(err);
            console.log(
              `${titleNames[3]} が挿入されました。\nrowid: ${this.lastID}`,
            );
            database.run(insertSQLError, [titleNames[4]], function (err) {
              if (err) return console.error(err);
              console.log(
                `${titleNames[4]} が挿入されました。\nrowid: ${this.lastID}`,
              );
              database.each(
                selectSQLError,
                (err, row) => {
                  if (err) return console.error(err);
                  console.log(`${row.id}: ${row.title}`);
                },
                (err) => {
                  if (err) return console.error(err);
                  database.run(dropTableSQL, (err) => {
                    if (err) return console.error(err);
                    console.log("テーブルを削除しました。");
                  });
                },
              );
            });
          });
        });
      });
    });
  });
} catch (err) {
  console.error(err);
}

await timers.setTimeout(2500);

/* Promise start */
const originalRun = sqlite3.Database.prototype.run;
const originalEach = sqlite3.Database.prototype.each;
const originalClose = sqlite3.Database.prototype.close;

sqlite3.Database.prototype.run = function (sqlQuery, params = []) {
  return new Promise((resolve, reject) => {
    if (typeof params === "function" || typeof params === "undefined") {
      params = [];
    }
    originalRun.call(this, sqlQuery, params, function (err) {
      if (err) reject(err);
      else {
        if (sqlQuery === createtableSQL) console.log("Books のテーブルを作成");
        else if (sqlQuery === insertSQL)
          console.log(`${params} が挿入されました。\nrowid: ${this.lastID}`);
        else if (sqlQuery === dropTableSQL)
          console.log("テーブルを削除しました。");
        else console.log("不正な SQL クエリです");
        resolve();
      }
    });
  });
};

sqlite3.Database.prototype.each = function (sqlQuery) {
  return new Promise((resolve, reject) => {
    originalEach.call(this, sqlQuery, function (err, row) {
      if (err) reject(err);
      else console.log(`${row.id}: ${row.title}`);
    });
    resolve();
  });
};

sqlite3.Database.prototype.close = function () {
  return new Promise((resolve, reject) => {
    originalClose.call(this, function (err) {
      if (err) reject(err);
      else {
        console.log("データベースをクローズしました。");
        resolve();
      }
    });
  });
};

database
  .run(createtableSQL)
  .then(() => database.run(insertSQL, [titleNames[0]]))
  .then(() => database.run(insertSQL, [titleNames[1]]))
  .then(() => database.run(insertSQL, [titleNames[2]]))
  .then(() => database.run(insertSQL, [titleNames[3]]))
  .then(() => database.run(insertSQL, [titleNames[4]]))
  .then(() => database.each(selectSQL))
  .then(() => database.run(dropTableSQL))
  .catch((err) => console.error(err));

await timers.setTimeout(2500);

/* Promise with error start */
database
  .run(createtableSQL)
  .then(() => database.run(insertSQLError, [titleNames[0]]))
  .then(() => database.run(insertSQLError, [titleNames[1]]))
  .then(() => database.run(insertSQLError, [titleNames[2]]))
  .then(() => database.run(insertSQLError, [titleNames[3]]))
  .then(() => database.run(insertSQLError, [titleNames[4]]))
  .then(() => database.each(selectSQLError))
  .then(() => database.run(dropTableSQL))
  .catch((err) => console.error(err));

await timers.setTimeout(2500);

/* async await start */
(async () => {
  try {
    await database.run(createtableSQL);
    await database.run(insertSQL, [titleNames[0]]);
    await database.run(insertSQL, [titleNames[1]]);
    await database.run(insertSQL, [titleNames[2]]);
    await database.run(insertSQL, [titleNames[3]]);
    await database.run(insertSQL, [titleNames[4]]);
    await database.each(selectSQL);
    await database.run(dropTableSQL);
  } catch (error) {
    console.error(error);
  }
})();

await timers.setTimeout(2500);

/* async await with error start */
(async () => {
  try {
    await database.run(createtableSQL);
    await database.run(insertSQLError, [titleNames[0]]);
    await database.run(insertSQLError, [titleNames[1]]);
    await database.run(insertSQLError, [titleNames[2]]);
    await database.run(insertSQLError, [titleNames[3]]);
    await database.run(insertSQLError, [titleNames[4]]);
    await database.each(selectSQLError);
    await database.run(dropTableSQL);
    await database.close();
  } catch (error) {
    console.error(error);
  }
})();
