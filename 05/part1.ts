import { readFile } from "fs/promises";
import { isCompliant, parseInput, takeMiddle } from "./lib";

// const inputFile = "example";
const inputFile = 'input'

main();

async function main() {
  const input = await readFile(`${__dirname}/${inputFile}`, "utf-8");
  const { rules, updates } = parseInput(input);
  const compliantUpdates = updates.filter((update) =>
    rules.every((rule) => isCompliant(update, rule))
  );
  const sumOfMiddles = compliantUpdates
    .map((update) => takeMiddle(update))
    .reduce((sum, value) => sum + value, 0);
  console.log(sumOfMiddles);
}


