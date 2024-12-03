import { readFile } from "fs/promises";
import { distanceSum, parseInput } from "./lib";

main();

async function main() {
  const input = await readFile(`${__dirname}/input`, "utf-8");
  const [list1, list2] = parseInput(input);
  const totalDistance = distanceSum(list1.toSorted(), list2.toSorted());
  console.log(totalDistance);
}
