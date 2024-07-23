#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

const database = new sqlite3.Database(":memory:");
const createTableSQL =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL UNIQUE);";
const insertSQL = "INSERT INTO books (title) VALUES (?)";
const selectSQL = "SELECT id, title FROM books";
const dropTableSQL = "DROP TABLE books";
const insertErrorSQL = "INSERT INTO boooks (title) VALUES (?)";
const selectErrorSQL = "SELECT id, tile FROM books";
const titles = [
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
        resolve(params.length ? params : []);
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

function closePromise(db) {
  return new Promise((resolve) => {
    db.close();
    resolve();
  });
}

function showStart(startType) {
  console.log("\x1b[36m%s\x1b[0m", "-".repeat(30));
  console.log("\x1b[36m%s\x1b[0m", `${startType} を開始`);
  console.log("\x1b[36m%s\x1b[0m", "-".repeat(30));
}

/* callback start */
showStart("callback");
database.run(createTableSQL, () => {
  console.log("Books のテーブルを作成");
  database.run(insertSQL, [titles[0]], function () {
    console.log(`${titles[0]} が挿入されました。\nrowid: ${this.lastID}`);
    database.run(insertSQL, [titles[1]], function () {
      console.log(`${titles[1]} が挿入されました。\nrowid: ${this.lastID}`);
      database.run(insertSQL, [titles[2]], function () {
        console.log(`${titles[2]} が挿入されました。\nrowid: ${this.lastID}`);
        database.run(insertSQL, [titles[3]], function () {
          console.log(`${titles[3]} が挿入されました。\nrowid: ${this.lastID}`);
          database.run(insertSQL, [titles[4]], function () {
            console.log(
              `${titles[4]} が挿入されました。\nrowid: ${this.lastID}`,
            );
            database.each(
              selectSQL,
              (err, row) => {
                if (err) return console.error(err);
                console.log(`${row.id}: ${row.title}`);
              },
              () => {
                database.run(dropTableSQL, () => {
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
  database.run(insertErrorSQL, [titles[0]], function (err) {
    try {
      if (err) throw err;
    } catch {
      console.error(err.message);
    }
    database.each(selectErrorSQL, (err) => {
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
    runPromise(database, insertSQL, titles[0]).then((params) => {
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
    runPromise(database, insertErrorSQL, titles[0])
      .then((params) => {
        console.log(`${params}`);
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        eachPromise(database, selectErrorSQL)
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

/* await start */
showStart("await");
await runPromise(database, createTableSQL);
console.log("books テーブルを作成しました。");
console.log(
  `${await runPromise(database, insertSQL, titles[0])} を挿入しました`,
);
console.log(
  `${await runPromise(database, insertSQL, titles[1])} を挿入しました`,
);
console.log(
  `${await runPromise(database, insertSQL, titles[2])} を挿入しました`,
);
const row = await eachPromise(database, selectSQL);
console.log(`id: ${row.id} title: ${row.title}`);
await runPromise(database, dropTableSQL);
console.log("books テーブルをドロップしました。");

await timers.setTimeout(2500);

/* await with error start */
showStart("await with error");
await runPromise(database, createTableSQL);
console.log("books テーブルを作成しました。");
try {
  await runPromise(database, insertErrorSQL, titles[0]);
} catch (err) {
  console.error(err.message);
}

try {
  await runPromise(database, insertErrorSQL, titles[1]);
} catch (err) {
  console.error(err.message);
}

try {
  await runPromise(database, insertErrorSQL, titles[2]);
} catch (err) {
  console.error(err.message);
}

try {
  await eachPromise(database, selectErrorSQL);
} catch (err) {
  console.error(err.message);
}

await runPromise(database, dropTableSQL);
console.log("books テーブルをドロップしました。");

await closePromise(database);
console.log("データベースをクローズする。");
