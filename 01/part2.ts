import { readFile } from "fs/promises";
import { parseInput } from "./lib";

main();

async function main() {
  const input = await readFile(`${__dirname}/input`, "utf-8");
  const [list1, list2] = parseInput(input);
  const countMap = countOccurences(list2);
  const multipliedList = list1.map((nbr) => nbr * (countMap.get(nbr) || 0));
  const similarityScore = multipliedList.reduce((sum, nbr) => sum + nbr, 0);
  console.log(similarityScore);
}

function countOccurences(input: number[]): Map<number, number> {
  return input.reduce(
    (map, nbr) => map.set(nbr, (map.get(nbr) || 0) + 1),
    new Map<number, number>()
  );
}
