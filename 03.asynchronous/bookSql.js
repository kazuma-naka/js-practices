#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

const database = new sqlite3.Database(":memory:");
const createTableSQL = `CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL UNIQUE);`;
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

function runPromise(db, sqlQuery, params = []) {
  return new Promise((resolve, reject) => {
    if (typeof params === "function" || typeof params === "undefined") {
      params = [];
    }
    db.run(sqlQuery, params, (err) => {
      try {
        if (err) throw err;
        if (params.length != 0) resolve(params);
        else resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

function eachPromise(db, sqlQuery) {
  return new Promise((resolve, reject) => {
    db.each(sqlQuery, (err, row) => {
      try {
        if (err) throw err;
        resolve(row);
      } catch (err) {
        reject(err);
      }
    });
  });
}

function showStart(startType) {
  console.log('\x1b[36m%s\x1b[0m',"-".repeat(30));
  console.log('\x1b[36m%s\x1b[0m',`${startType} を開始`);
  console.log('\x1b[36m%s\x1b[0m',"-".repeat(30));
}

/* callback start */
showStart("callback");
database.run(createTableSQL, (err) => {
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
showStart("callback with error");
database.run(createTableSQL, (err) => {
  if (err) throw err;
  console.log("Books のテーブルを作成");
  database.run(insertSQLError, [titleNames[0]], function (err) {
    try {
      if (err) throw err;
    } catch {
      console.error(err.message);
    }
    database.each(selectSQLError, (err) => {
      try {
        if (err) throw err;
      } catch {
        console.error(err.message);
      }
      database.run(dropTableSQL, (err) => {
        if (err) throw err;
        console.log("テーブルを削除しました。");
      });
    });
  });
});

await timers.setTimeout(2500);

/* Promise start */
showStart("Promise");
runPromise(database, createTableSQL)
  .then(() => {
    console.log("books テーブルを作成しました。");
    runPromise(database, insertSQL, titleNames[0]).then((params) => {
      console.log(`${params} を挿入しました。`);
      eachPromise(database, selectSQL).then((row) => {
        console.log(`id: ${row.id} title: ${row.title}`);
        runPromise(database, dropTableSQL).then(() => {
          console.log("books テーブルをドロップしました。");
        });
      });
    });
  })
  .catch((err) => console.error(err));

await timers.setTimeout(2500);

/* Promise with error start */
showStart("Promise with error");
runPromise(database, createTableSQL)
  .then(() => {
    console.log("books テーブルを作成しました。");
    runPromise(database, insertSQLError, titleNames[0])
      .then((params) => {
        console.log(`${params}`);
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        eachPromise(database, selectSQLError)
          .catch((err) => console.error(err.message))
          .finally(() => {
            runPromise(database, dropTableSQL).then(() => {
              console.log("books テーブルをドロップしました。");
            });
          });
      });
  })
  .catch((err) => console.error(err.message));

await timers.setTimeout(2500);
