import fs from "fs";
import words from "./words.mjs";
import hanzi from "./hanzi.mjs";

let toExport = {};
Object.keys(hanzi)
  .slice(0, 4000)
  .forEach(f => {
    const matches = words.filter(x => x.includes(f));
    matches.slice(0, 4).forEach(x => (toExport[x] = true));
  });

let exp = [];
words.forEach(x => {
  if (toExport[x]) {
    exp.push(x);
  }
});

console.log(JSON.stringify(exp));
