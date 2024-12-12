import { readFile } from "fs/promises";

const inputFile = "example";
// const inputFile = 'input'

let breadCrumb = true;
main();

async function main() {
  const input = await readFile(`${__dirname}/${inputFile}`, "utf-8");
  const gallivantGuardMap = parseInput(input);
  // const originalPosition = gallivantGuardMap.guardPosition;
  // const originalDirection = gallivantGuardMap.direction;
  const finalMap = iter(gallivantGuardMap);
  breadCrumb = false;
  const possibleObstructions = findObstructionsNbr(finalMap);
  // console.log(finalMap);
  console.log(possibleObstructions);
  // console.log(originalPosition);
  // console.log(originalDirection)
}

export function parseInput(input: string): GallivantGuardMap {
  const grid = input.split("\n").map((line) => line.split(""));
  const width = grid[0].length;
  const height = grid.length;
  const { guardPosition, direction } = findGuard(grid);
  const stateHashes = new Set<string>();

  stateHashes.add(encodeGuardState(guardPosition, direction));
  const obstacles = findAllObstaclesCoordinates(grid);
  const possibleObstructions: Coordinates[] = [];
  return {
    width,
    height,
    stateHashes,
    guardPosition,
    obstacles,
    direction,
    possibleObstructions,
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
  stateHashes: Set<string>;
  guardPosition: Coordinates;
  direction: Direction;
  obstacles: Coordinates[];
  possibleObstructions: Coordinates[];
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
  const positionHashes = new Set(map.stateHashes);
  if (!hasGuardLeft(updatedMap) && breadCrumb) {
    positionHashes.add(encodeGuardState(newPosition, direction));
  }
  return {
    ...updatedMap,
    stateHashes: positionHashes,
  };
}
function encodeGuardState({ x, y }: Coordinates, direction: Direction): string {
  return `${x.toString().padStart(6, "0")}-${y.toString().padStart(6, "0")}-${direction}`;
}
function decodeGuardState(code: string): {
  position: Coordinates;
  direction: Direction;
} {
  const [x, y, direction] = code
    .split("-")
    .map((value, index) => (index < 2 ? Number(value) : value));
  return {
    position: { x, y } as Coordinates,
    direction: direction as Direction,
  };
}
function findObstructionsNbr(map: GallivantGuardMap): number {
  // récupère la liste des position/direction du parcours du garde
  const states = [...map.stateHashes].map((code) => {
    // pour chaque état du parcours on fais tourner le garde à droite( comme si un obstacle était devant et on continue jusqu'à ce que soit il soit dehors, soit il rejoigne une position déj)à
    const { position, direction } = decodeGuardState(code);
    // console.log(position, direction);
    const obstacleInFront = hasObstacle({
      ...map,
      guardPosition: position,
      direction
    })
    const turnDirection =
      direction === "left"
        ? "up"
        : direction === "up"
          ? "right"
          : direction === "right"
            ? "down"
            : "left";
    const tryMap = {
      ...map,
      guardPosition: position,
      direction: turnDirection as Direction,
    };
    return doesLoop(tryMap) && !obstacleInFront
  });
  return states.filter(s => s).length;
}
function doesLoop(map: GallivantGuardMap) {
  let iterMap = next(map);
  while (!hasGuardLeft(iterMap)) {
    iterMap = next(iterMap);
    if (
      map.stateHashes.has(
        encodeGuardState(iterMap.guardPosition, iterMap.direction)
      )
    ) {
      console.log('loops', iterMap.guardPosition, iterMap.direction  )
      return true;
    }
  }
  return false;
}
