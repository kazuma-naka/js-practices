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
                  database.close((err) => {
                    if (err) return console.error(err);
                    console.log("データベースをクローズしました。");
                  });
                });
              },
            );
          });
        });
      });
    });
  });
});

await timers.setTimeout(2000);

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
                    database.close((err) => {
                      if (err) return console.error(err);
                      console.log("データベースをクローズしました。");
                    });
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
