#! /usr/bin/env node

import BooksDatabase from "./BooksDatabase.js";

const booksDatabase = new BooksDatabase();

asyncCallback();

function asyncCallback() {
  setTimeout(() => {
    booksDatabase.create();
    setTimeout(() => {
      booksDatabase.insert("test book");
      setTimeout(() => {
        booksDatabase.show();
        setTimeout(() => {
          booksDatabase.dropTable();
          setTimeout(() => {
            booksDatabase.close();
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}
