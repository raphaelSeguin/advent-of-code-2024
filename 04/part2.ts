import { readFile } from "fs/promises";
import { rotate90 } from "./lib";

main();

async function main() {
  const input = await readFile(`${__dirname}/input`, "utf-8");
  const squares = parseInput(input);
  const result = squares
    .flatMap((square) => {
      const ninety = rotate90(square);
      const hundredEighty = rotate90(ninety);
      const twoHundredSeventy = rotate90(hundredEighty);
      return [square, ninety, hundredEighty, twoHundredSeventy];
    })
    .filter((square: string) => isXmasSquare(square)).length;
  console.log(result);
}

function isXmasSquare(square: string): boolean {
  return /M.M\n.A.\nS.S/.test(square);
}

function parseInput(str: string): string[] {
  const lines = str.split("\n");
  const width = lines[0].length;
  const height = lines.length;
  const squares = [];
  for (let h = 0; h < width - 2; h += 1) {
    for (let v = 0; v < height - 2; v += 1) {
      squares.push(takeSquare(lines, h, v));
    }
  }
  return squares;
}

function takeSquare(input: string[], offsetX: number, offsetY: number): string {
  let square = "";
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      square += input[y + offsetY][x + offsetX];
    }
    if (x < 2) {
      square += "\n";
    }
  }
  return square;
}
