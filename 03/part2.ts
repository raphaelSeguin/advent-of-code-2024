import { readFile } from "fs/promises";

main();

async function main() {
  const input = await readFile(`${__dirname}/input`, "utf-8");
  const program = input.split(/(do\(\)|don't\(\))/);
  const result = interpret(program);
  console.log(result)
}

function interpret(program: string[]) {
  let sum = 0;
  let enabled = true;
  for (const item of program) {
    if (item === "do()") {
      enabled = true;
      continue;
    }
    if (item === "don't()") {
      enabled = false;
      continue;
    }
    if (enabled) {
      const operations = parseInput(item);
      sum += operations.reduce((sum, expression) => {
        const [_, operand1, operand2] = [
          ...(expression.match(/(\d*),(\d*)/) || []),
        ];
        return sum + parseInt(operand1, 10) * parseInt(operand2, 10);
      }, 0);
    }
  }
  return sum
}

function parseInput(str: string): string[] {
  return [...str.matchAll(/mul\(\d{1,3},\d{1,3}\)/g)].map((match) => match[0]);
}
