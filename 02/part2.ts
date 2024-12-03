import { readFile } from "fs/promises";

main();

async function main() {
  const input = await readFile(`${__dirname}/input`, "utf-8");
  const reports = parseInput(input);
  const safeCount = reports.reduce((count, report) => {
    const dampenedList = dampenList(report)
    return count + (dampenedList.some((list) =>isSafe(list)) ? 1 : 0);
  }, 0);
  console.log(safeCount);
}
type level = number;
type Reports = level[];
type Direction = "increasing" | "decreasing" | "neither";

function parseInput(input: string): Reports[] {
  return input
    .split("\n")
    .map((line) => line.split(" ").map((str) => parseInt(str, 10)));
}

const getDirection = (a: number, b: number): Direction =>
  a < b ? "increasing" : a > b ? "decreasing" : "neither";

const distance = (a: number, b: number): number => Math.abs(a - b);

function isSafe(report: Reports) {
  const direction: Direction = getDirection(report[0], report[1]);

  for (let i = 0; i < report.length - 1; i += 1) {
    const [value, nextValue] = [report[i], report[i + 1]];
    const newDirection = getDirection(value, nextValue);
    const speed = distance(value, nextValue);
    if (newDirection !== direction || speed > 3) {
      return false;
    }
  }
  return true;
}

function dampenList<T>(list: T[]): T[][] {
  const result = []
  for (let i = 0; i < list.length; i += 1) {
    result.push(list.filter((_, index) => index !== i))
  }
  return result
}