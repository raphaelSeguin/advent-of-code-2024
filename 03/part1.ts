import { readFile } from "fs/promises";

main();

async function main() {
  const input = await readFile(`${__dirname}/input`, "utf-8");
  const program = parseInput(input);
  const sum = program.reduce((sum, expression) => {
    const [_, operand1, operand2] = [
      ...(expression.match(/(\d*),(\d*)/) || []),
    ];
    return sum + parseInt(operand1, 10) * parseInt(operand2, 10);
  }, 0);
  console.log(sum);
}

function parseInput(str: string): string[] {
  return [...str.matchAll(/mul\(\d{1,3},\d{1,3}\)/g)].map((match) => match[0]);
}
