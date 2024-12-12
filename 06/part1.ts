import { readFile } from "fs/promises";

// const inputFile = "example";
const inputFile = 'input'

main();

async function main() {
  const input = await readFile(`${__dirname}/${inputFile}`, "utf-8");
  const gallivantGuardMap = parseInput(input);
  const finalMap = iter(gallivantGuardMap);
  console.log(finalMap.positionHashes.size);
}
export function parseInput(input: string): GallivantGuardMap {
  const grid = input.split("\n").map((line) => line.split(""));
  const width = grid[0].length;
  const height = grid.length;
  const { guardPosition, direction } = findGuard(grid);
  const positionHashes = new Set<string>();
  positionHashes.add(hashPosition(guardPosition));
  const obstacles = findAllObstaclesCoordinates(grid);
  return {
    width,
    height,
    positionHashes,
    guardPosition,
    obstacles,
    direction,
  };
}

type Coordinates = {
  x: number;
  y: number;
};
type Direction = "up" | "right" | "down" | "left";

type GallivantGuardMap = {
  width: number;
  height: number;
  positionHashes: Set<string>;
  guardPosition: Coordinates;
  direction: Direction;
  obstacles: Coordinates[];
};
function iter(map: GallivantGuardMap): GallivantGuardMap {
  if (hasGuardLeft(map)) {
    return map;
  }
  return iter(next(map));
}
function next(map: GallivantGuardMap): GallivantGuardMap {
  const fixedDirection = findWay(map);
  return stepForward(fixedDirection);
}
function findWay(map: GallivantGuardMap): GallivantGuardMap {
  if (hasObstacle(map)) {
    return findWay(turnRight(map));
  }
  return map;
}
function hasGuardLeft(map: GallivantGuardMap): boolean {
  const {
    guardPosition: { x, y },
    width,
    height,
  } = map;
  return x < 0 || x > width - 1 || y < 0 || y > height - 1;
}
function hasObstacle(map: GallivantGuardMap): boolean {
  const {
    direction,
    obstacles,
    guardPosition: { x, y },
  } = map;
  const headingCoordinates: Coordinates = {
    x: direction === "left" ? x - 1 : direction === "right" ? x + 1 : x,
    y: direction === "up" ? y - 1 : direction === "down" ? y + 1 : y,
  };
  return (
    obstacles.findIndex(
      ({ x, y }) => headingCoordinates.x === x && headingCoordinates.y === y
    ) !== -1
  );
}
function turnRight(map: GallivantGuardMap): GallivantGuardMap {
  const { direction } = map;
  return {
    ...map,
    direction:
      direction === "left"
        ? "up"
        : direction === "up"
          ? "right"
          : direction === "right"
            ? "down"
            : "left",
  };
}
function findAllObstaclesCoordinates(grid: string[][]) {
  const obstacles = [];
  for (let x = 0; x < grid[0].length; x++) {
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] === "#") {
        obstacles.push({ x, y });
      }
    }
  }
  return obstacles;
}

function findGuard(grid: string[][]): {
  guardPosition: Coordinates;
  direction: Direction;
} {
  for (let x = 0; x < grid[0].length; x++) {
    for (let y = 0; y < grid.length; y++) {
      const match = grid[y][x].match(/<|>|\^|v/)?.[0];
      if (match) {
        const direction =
          match === "^"
            ? "up"
            : match === ">"
              ? "right"
              : match === "v"
                ? "down"
                : "left";
        return {
          guardPosition: { x, y },
          direction,
        };
      }
    }
  }
  throw Error("Guard Not Found !");
}
function stepForward(map: GallivantGuardMap): GallivantGuardMap {
  const {
    direction,
    guardPosition: { x, y },
  } = map;
  const newPosition =
    direction === "up"
      ? { x: x, y: y - 1 }
      : direction === "right"
        ? { x: x + 1, y }
        : direction === "down"
          ? { x, y: y + 1 }
          : { x: x - 1, y };
  const updatedMap = {
    ...map,
    guardPosition: newPosition,
  };
  const positionHashes = new Set(map.positionHashes);
  if (!hasGuardLeft(updatedMap)) {
    positionHashes.add(hashPosition(newPosition));
  }
  return {
    ...updatedMap,
    positionHashes,
  };
}
function hashPosition({ x, y }: Coordinates): string {
  return `${x.toString().padStart(6, '0')}-${y.toString().padStart(6, '0')}`;
}
