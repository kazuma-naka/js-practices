#!/usr/bin/env node

import MyMemo from "./MyMemo.js";

const myMemo = new MyMemo();
if (process.argv.length > 2) {
  const argument = process.argv.slice(2)[0];
  if (argument === "-l") {
    myMemo.lookUp();
  } else if (argument === "-r") {
    myMemo.reference();
  } else if (argument === "-d") {
    myMemo.delete();
  } else if (argument === "-e") {
  }
} else {
  myMemo.create();
}
