#! /usr/bin/env node

import BooksDatabase from "./BooksDatabase.js";

const booksDatabase = new BooksDatabase();

asyncAwait();

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

function asyncPromise() {
  booksDatabase
    .createWithPromise()
    .then(() => {
      return booksDatabase.insertWithPromise("test book title");
    })
    .then(() => {
      return booksDatabase.insertWithPromise("test book title 2");
    })
    .then(() => {
      return booksDatabase.insertWithPromise("test book title 3");
    })
    .then(() => {
      return booksDatabase.insertWithPromise("test book title 4");
    })
    .then(() => {
      return booksDatabase.insertWithPromise("test book title 5");
    })
    .then(() => {
      return booksDatabase.showWithPromise();
    })
    .then(() => {
      return booksDatabase.dropTableWithPromise();
    })
    .then(() => {
      return booksDatabase.closeWithPromise();
    })
    .catch((error) => {
      console.error(error);
    });
}

function asyncAwait() {
    (async () => {
        await booksDatabase.createWithPromise();
        await booksDatabase.insertWithPromise("test book title");
        await booksDatabase.insertWithPromise("test book title 2");
        await booksDatabase.insertWithPromise("test book title 3");
        await booksDatabase.insertWithPromise("test book title 4");
        await booksDatabase.insertWithPromise("test book title 5");
        await booksDatabase.showWithPromise();
        await booksDatabase.dropTableWithPromise();
        await booksDatabase.closeWithPromise();
    })();
}
