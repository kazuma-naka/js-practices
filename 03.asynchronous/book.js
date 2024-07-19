#! /usr/bin/env node

import BooksDatabase from "./BooksDatabase.js";

const booksDatabase = new BooksDatabase();

//asyncCallbackError();
//asyncPromiseError();
setTimeout(() => {
    asyncAwait();
}, 5000);
asyncAwaitError();

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

function asyncCallbackError() {
  setTimeout(() => {
    booksDatabase.create();
    setTimeout(() => {
      booksDatabase.insertHasError("test book");
      setTimeout(() => {
        booksDatabase.showHasError();
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

function asyncPromiseError() {
  booksDatabase
    .createWithPromise()
    .then(() => {
      return booksDatabase.insertWithPromiseHasError("test book title");
    })
    .then(() => {
      return booksDatabase.insertWithPromiseHasError("test book title 2");
    })
    .then(() => {
      return booksDatabase.insertWithPromiseHasError("test book title 3");
    })
    .then(() => {
      return booksDatabase.insertWithPromiseHasError("test book title 4");
    })
    .then(() => {
      return booksDatabase.insertWithPromiseHasError("test book title 5");
    })
    .then(() => {
      return booksDatabase.showWithPromiseHasError();
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
    try {
      await booksDatabase.createWithPromise();
      await booksDatabase.insertWithPromise("test book title");
      await booksDatabase.insertWithPromise("test book title 2");
      await booksDatabase.insertWithPromise("test book title 3");
      await booksDatabase.insertWithPromise("test book title 4");
      await booksDatabase.insertWithPromise("test book title 5");
      await booksDatabase.showWithPromise();
      await booksDatabase.dropTableWithPromise();
      await booksDatabase.closeWithPromise();
    } catch (error) {
      console.error(error);
    }
  })();
}

function asyncAwaitError() {
  (async () => {
    try {
      await booksDatabase.createWithPromise();
      await booksDatabase.insertWithPromiseHasError("test book title");
      await booksDatabase.insertWithPromiseHasError("test book title 2");
      await booksDatabase.insertWithPromiseHasError("test book title 3");
      await booksDatabase.insertWithPromiseHasError("test book title 4");
      await booksDatabase.insertWithPromiseHasError("test book title 5");
      await booksDatabase.showWithPromiseHasError();
      await booksDatabase.dropTableWithPromise();
      await booksDatabase.closeWithPromise();
    } catch (error) {
      console.error(error);
    }
  })();
}
