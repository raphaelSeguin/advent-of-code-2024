import { readFile } from "fs/promises";
import { rotate90, takeHorizontals, takeVerticals } from "./lib";

main();

async function main() {
  const input = await readFile(`${__dirname}/input`, "utf-8");
  const { horizontals, verticals, diagonals, antediagonals } =
    parseInput(input);
  const result = [horizontals, verticals, diagonals, antediagonals]
    .map((axe) => {
      return axe
        .map(
          (line) =>
            [...line.matchAll(/XMAS/g)].length +
            [...reverse(line).matchAll(/XMAS/g)].length
        )
        .reduce((sum, value) => sum + value, 0);
    })
    .reduce((sum, value) => sum + value, 0);
  console.log(result);
}

// Quick TDD :)
console.assert(takeHorizontals("AB\nCD")[0] === "AB", "first horizontal");
console.assert(takeHorizontals("AB\nCD")[1] === "CD", "second horizontal");

console.assert(takeVerticals("AB\nCD")[0] === "AC", "first vertical");
console.assert(takeVerticals("AB\nCD")[1] === "BD", "second vertical");
console.assert(
  takeDiagonals("AB\nCD")[0] === "A",
  "first diagonal going up from left to right"
);
console.assert(
  takeDiagonals("AB\nCD")[1] === "BC",
  "second diagonal going up from left to right"
);
console.assert(
  takeDiagonals("AB\nCD")[2] === "D",
  "third diagonal going up from left to right"
);
console.assert(rotate90("AB\nCD") === "BD\nAC", "rotate 90 degrees");
console.assert(
  takeAntediagonals("AB\nCD")[0] === "B",
  "first diagonal going down from left to right"
);
console.assert(
  takeAntediagonals("AB\nCD")[1] === "DA",
  "second diagonal going down from left to right"
);
console.assert(
  takeAntediagonals("AB\nCD")[2] === "C",
  "third diagonal going down from left to right"
);
console.assert(reverse("XMAS") === "SAMX", "reverse string");

type ParsedInput = {
  verticals: string[];
  horizontals: string[];
  diagonals: string[];
  antediagonals: string[];
};

function parseInput(str: string): ParsedInput {
  return {
    verticals: takeVerticals(str),
    horizontals: takeHorizontals(str),
    diagonals: takeDiagonals(str),
    antediagonals: takeAntediagonals(str),
  };
}

function takeDiagonals(str: string): string[] {
  const horizontals = takeHorizontals(str);
  const height = horizontals.length;
  const diagonals = [];
  for (let h = 0; h < horizontals[0].length * 2 - 1; h += 1) {
    let diagonal = "";
    for (let v = 0; v < height; v += 1) {
      debugger;
      diagonal += horizontals[v]?.[h - v] || "";
    }
    diagonals.push(diagonal);
  }
  return diagonals;
}
function takeAntediagonals(str: string): string[] {
  return takeDiagonals(rotate90(str));
}
function reverse(str: string): string {
  return [...str].reverse().join("");
}
