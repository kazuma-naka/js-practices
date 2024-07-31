#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

const CREATE_TABLE_SQL =
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL UNIQUE);";
const INSERT_SQL = "INSERT INTO books (title) VALUES (?)";
const SELECT_SQL = "SELECT DISTINCT id, title FROM books ORDER BY id";
const DROP_TABLE_SQL = "DROP TABLE books";
const INSERT_ERROR_SQL = "INSERT INTO boooks (title) VALUES (?)";
const SELECT_ERROR_SQL = "SELECT id, tile FROM books";

function runPromise(db, sqlQuery, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sqlQuery, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function allPromise(db, sqlQuery) {
  return new Promise((resolve, reject) => {
    db.all(sqlQuery, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function closePromise(db) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function showStart(startType) {
  console.log("\x1b[36m%s\x1b[0m", "-".repeat(30));
  console.log("\x1b[36m%s\x1b[0m", `${startType} を開始`);
  console.log("\x1b[36m%s\x1b[0m", "-".repeat(30));
}

const database = new sqlite3.Database(":memory:");
const titles = [
  "To Kill a Mockingbird",
  "1984",
  "The Great Gatsby",
  "Pride and Prejudice",
  "The Catcher in the Rye",
];

/* callback start */
showStart("callback");
database.run(CREATE_TABLE_SQL, () => {
  console.log("books テーブルを作成しました。");
  database.run(INSERT_SQL, [titles[0]], function () {
    console.log(`id: ${this.lastID}`);
    database.run(INSERT_SQL, [titles[1]], function () {
      console.log(`id: ${this.lastID}`);
      database.run(INSERT_SQL, [titles[2]], function () {
        console.log(`id: ${this.lastID}`);
        database.run(INSERT_SQL, [titles[3]], function () {
          console.log(`id: ${this.lastID}`);
          database.run(INSERT_SQL, [titles[4]], function () {
            console.log(`id: ${this.lastID}`);
            database.all(SELECT_SQL, (_, rows) => {
              for (const row of rows) {
                console.log(`id: ${row.id} title: ${row.title}`);
              }
              database.run(DROP_TABLE_SQL, () => {
                console.log("books テーブルを削除しました。");
              });
            });
          });
        });
      });
    });
  });
});

await timers.setTimeout(2500);

/* callback with error start */
showStart("callback with error");
database.run(CREATE_TABLE_SQL, () => {
  console.log("books テーブルを作成しました。");
  database.run(INSERT_ERROR_SQL, [titles[0]], function (err) {
    console.error(err.message);
    database.run(INSERT_ERROR_SQL, [titles[1]], function (err) {
      console.error(err.message);
      database.run(INSERT_ERROR_SQL, [titles[2]], function (err) {
        console.error(err.message);
        database.run(INSERT_ERROR_SQL, [titles[3]], function (err) {
          console.error(err.message);
          database.run(INSERT_ERROR_SQL, [titles[4]], function (err) {
            console.error(err.message);
            database.all(SELECT_ERROR_SQL, (err) => {
              console.error(err.message);
              database.run(DROP_TABLE_SQL, () => {
                console.log("books テーブルを削除しました。");
              });
            });
          });
        });
      });
    });
  });
});

await timers.setTimeout(2500);

/* Promise start */
showStart("Promise");
runPromise(database, CREATE_TABLE_SQL)
  .then(() => {
    console.log("books テーブルを作成しました。");
    return runPromise(database, INSERT_SQL, titles[0]);
  })
  .then((result) => {
    console.log(`id: ${result.lastID}`);
    return runPromise(database, INSERT_SQL, titles[1]);
  })
  .then((result) => {
    console.log(`id: ${result.lastID}`);
    return runPromise(database, INSERT_SQL, titles[2]);
  })
  .then((result) => {
    console.log(`id: ${result.lastID}`);
    return runPromise(database, INSERT_SQL, titles[3]);
  })
  .then((result) => {
    console.log(`id: ${result.lastID}`);
    return runPromise(database, INSERT_SQL, titles[4]);
  })
  .then((result) => {
    console.log(`id: ${result.lastID}`);
    return allPromise(database, SELECT_SQL);
  })
  .then((rows) => {
    for (const row of rows) {
      console.log(`id: ${row.id} title: ${row.title}`);
    }
    return runPromise(database, DROP_TABLE_SQL);
  })
  .then(() => {
    console.log("books テーブルを削除しました。");
  });

await timers.setTimeout(2500);

/* Promise with error start */
showStart("Promise with error");
runPromise(database, CREATE_TABLE_SQL)
  .then(() => {
    console.log("books テーブルを作成しました。");
    return runPromise(database, INSERT_ERROR_SQL, titles[0]);
  })
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => runPromise(database, INSERT_ERROR_SQL, titles[1]))
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => runPromise(database, INSERT_ERROR_SQL, titles[2]))
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => runPromise(database, INSERT_ERROR_SQL, titles[3]))
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => runPromise(database, INSERT_ERROR_SQL, titles[4]))
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => allPromise(database, SELECT_ERROR_SQL))
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => runPromise(database, DROP_TABLE_SQL))
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => {
    console.log("books テーブルを削除しました。");
  });

await timers.setTimeout(2500);

/* await start */
showStart("await");
await runPromise(database, CREATE_TABLE_SQL);
console.log("books テーブルを作成しました。");
const statementObject0 = await runPromise(database, INSERT_SQL, titles[0]);
console.log(`id: ${statementObject0.lastID}`);
const statementObject1 = await runPromise(database, INSERT_SQL, titles[1]);
console.log(`id: ${statementObject1.lastID}`);
const statementObject2 = await runPromise(database, INSERT_SQL, titles[2]);
console.log(`id: ${statementObject2.lastID}`);
const statementObject3 = await runPromise(database, INSERT_SQL, titles[3]);
console.log(`id: ${statementObject3.lastID}`);
const statementObject4 = await runPromise(database, INSERT_SQL, titles[4]);
console.log(`id: ${statementObject4.lastID}`);
const rows = await allPromise(database, SELECT_SQL);
for (const row of rows) {
  console.log(`id: ${row.id} title: ${row.title}`);
}
await runPromise(database, DROP_TABLE_SQL);
console.log("books テーブルを削除しました。");

await timers.setTimeout(2500);

/* await with error start */
showStart("await with error");
await runPromise(database, CREATE_TABLE_SQL);
console.log("books テーブルを作成しました。");
try {
  await runPromise(database, INSERT_ERROR_SQL, titles[0]);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}
try {
  await runPromise(database, INSERT_ERROR_SQL, titles[1]);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}
try {
  await runPromise(database, INSERT_ERROR_SQL, titles[2]);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}
try {
  await runPromise(database, INSERT_ERROR_SQL, titles[3]);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}
try {
  await runPromise(database, INSERT_ERROR_SQL, titles[4]);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}
try {
  await allPromise(database, SELECT_ERROR_SQL);
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}
await runPromise(database, DROP_TABLE_SQL);
console.log("books テーブルを削除しました。");
await closePromise(database);
