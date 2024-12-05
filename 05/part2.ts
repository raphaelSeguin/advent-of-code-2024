import { readFile } from "fs/promises";
import { isCompliant, parseInput, Rule, takeMiddle, Update } from "./lib";

const inputFile = "input";

main();

async function main() {
  const input = await readFile(`${__dirname}/${inputFile}`, "utf-8");
  const { rules, updates } = parseInput(input);
  const incorrectUpdates = updates.filter((update) =>
    rules.some((rule) => !isCompliant(update, rule))
  );

  const sumOfSortedMiddles = incorrectUpdates
    .map((update) => takeMiddle(update.toSorted(makeSortFn(rules))))
    .reduce((sum, value) => sum + value, 0);
  console.log(sumOfSortedMiddles);
}

function makeSortFn(rules: Rule[]) {
  return function sortFn(a: number, b: number): number {
    const rule = rules.find(
      (rule) =>
        (rule.before === a && rule.after === b) ||
        (rule.before === b && rule.after === a)
    );
    if (!rule) {
      return 0;
    }
    return rule.before === a ? -1 : 1;
  };
}
