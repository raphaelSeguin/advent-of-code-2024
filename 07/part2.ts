import { readFile } from "fs/promises";

// const inputFile = "example";
const inputFile = 'input'

main();

async function main() {
  const input = await readFile(`${__dirname}/${inputFile}`, "utf-8");
  const equations = parseInput(input);
  const trueEquationsSum = equations
    .filter((equation) => isSolvable(equation))
    .reduce((sum, { value }) => sum + value, BigInt(0));
  console.log(trueEquationsSum);
}

type Equation = {
  value: bigint;
  operands: bigint[];
};

function parseInput(input: string): Equation[] {
  return input.split("\n").map((line) => {
    const [value, operandsList] = line.split(":");
    return {
      value: BigInt(value),
      operands: operandsList
        .trim()
        .split(" ")
        .map((operand) => BigInt(operand)),
    };
  });
}

function isSolvable(equation: Equation): boolean {
  const {value, operands} = equation
  const operations = [mult, add, concat]
  let base = [operands[0]]
  for (const operand of operands.slice(1)) {
    const stage = []
    for (const op2 of base) {
      for (const fn of operations) {
        stage.push(fn(op2, operand))
      }
    }
    base = stage
  }
  return base.includes(value)
}

function mult(op1: bigint, op2 = BigInt(1)) {
  return op1 * op2
}
function add(op1: bigint, op2 = BigInt(0)) {
  return op1 + op2
}
function concat(op1: bigint, op2 = BigInt(0)) {
  return BigInt(`${op1.toString()}${op2.toString()}`)
}
