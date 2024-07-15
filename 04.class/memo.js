#!/usr/bin/env node

import readline from "readline";
import MyMemo from "./MyMemo.js";

const myMemo = new MyMemo();
if (process.argv.length > 2) {
  const argument = process.argv.slice(2)[0];
  if (argument === "-l") {
  } else if (argument === "-r") {
  } else if (argument === "-d") {
  } else if (argument === "-e") {
  }
} else {
  addingMemo();
}

function addingMemo() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let inputLines = [];

  console.log("メモの本文を入力してください");
  console.log("eof で入力を終了");

  rl.on("line", (input) => {
    if (input.trim().toUpperCase() === "EOF") {
      rl.close();
    } else {
      inputLines.push(input);
    }
  });

  rl.on("close", () => {
    myMemo.create(inputLines.join("\n"));
  });
}
