import { readFile } from "fs/promises";

// const inputFile = "example";
const inputFile = "input";
// The code for the part 2 is actually shorter than for part1
// all I had to do was to remove the function uniqueNodes
// that I used at every stage in the altitude loop of the
// first part to make sure paths were not forking!

type Node = {
  x: number;
  y: number;
  value: number;
};

main();

async function main() {
  const input = await readFile(`${__dirname}/${inputFile}`, "utf-8");
  const pathNodes = parseInput(input);
  const trailHeads = pathNodes.filter(({ value }) => value === 0);
  console.log(trailHeads);
  let score = 0;
  for (let trailHead of trailHeads) {
    let trail = [trailHead];
    for (let altitude = 0; altitude < 9; altitude += 1) {
      trail = trail.flatMap(({ x, y, value }) =>
        pathNodes.filter(({ x: nx, y: ny, value: nvalue }) => {
          return (
            ((Math.abs(x - nx) === 1 && ny === y) ||
              (Math.abs(y - ny) === 1 && nx === x)) &&
            nvalue === value + 1
          );
        })
      );
    }
    score += trail.length;
  }
  console.log(score);
}

function parseInput(input: string): Node[] {
  return input
    .split("\n")
    .flatMap((line, y) =>
      line
        .split("")
        .map((altitude, x) => ({ x, y, value: parseInt(altitude, 10) }))
    );
}

function uniqueNodes(nodes: Node[]): Node[] {
  const encode = ({ x, y, value }: Node): string => `${x}-${y}-${value}`;
  const decode = (input: string): Node => {
    const [x, y, value] = input.split("-").map((v) => parseInt(v, 10));
    return { x, y, value };
  };
  return [...new Set(nodes.map(encode))].map(decode);
}
