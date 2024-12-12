import { readFile } from "fs/promises";

// const inputFile = "example";
const inputFile = "input";

type Antenna = {
  type: string;
  x: number;
  y: number;
};
type AntennaMap = {
  height: number;
  width: number;
  antennas: Map<string, Antenna[]>;
};

main();

async function main() {
  const input = await readFile(`${__dirname}/${inputFile}`, "utf-8");
  const antennaMap = parseInput(input);
  const antinodes = [...antennaMap.antennas.values()].flatMap((antennas) => {
    const couples = createCombinations(antennas);
    return couples.flatMap((couple) => locateAntinodes(couple, antennaMap.width, antennaMap.height));
  });
  console.log(
    countDistinctLocations(
      antinodes.filter(({ x, y }) =>
        isInside(x, y, antennaMap.width, antennaMap.height)
      )
    )
  );
}
function parseInput(input: string): AntennaMap {
  const grid = input.split("\n").map((line) => line.split(""));
  const width = grid[0].length;
  const height = grid.length;
  const antennas = locateAntennas(grid);
  return {
    width,
    height,
    antennas: antennas.reduce(
      (map, antenna) =>
        map.set(antenna.type, [...(map.get(antenna.type) || []), antenna]),
      new Map<string, Antenna[]>()
    ),
  };
}

function locateAntennas(grid: string[][]): Antenna[] {
  const antennas: Antenna[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] !== ".") {
        antennas.push({
          type: grid[y][x],
          x,
          y,
        });
      }
    }
  }
  return antennas;
}

function createCombinations<T>(list: T[]): T[][] {
  const result = [];
  for (let i = 0; i < list.length - 1; i++) {
    for (let j = i + 1; j < list.length; j++) {
      result.push([list[i], list[j]]);
    }
  }
  return result;
}
function isInside(x: number, y: number, width: number, height: number) {
  return x >= 0 && y >= 0 && x < width && y < height;
}
function countDistinctLocations(locations: { x: number; y: number }[]): number {
  const uniqueLocations = new Set<string>(
    locations.map(
      ({ x, y }) =>
        `${x.toString().padStart(6, "0")}${y.toString().padStart(6, "0")}`
    )
  );
  return uniqueLocations.size;
}

function locateAntinodes(couple: Antenna[], width: number, height: number): { x: number; y: number }[] {
  const diffX = couple[0].x - couple[1].x;
  const diffY = couple[0].y - couple[1].y;
  let x = couple[0].x, y = couple[0].y
  while(isInside(x - diffX, y - diffY, width, height)) {
    x -= diffX
    y -= diffY
  }
  const antinodes = []
  while(isInside(x, y, width, height))  {
    antinodes.push({x, y})
    x += diffX
    y += diffY
  }
  return antinodes
}
