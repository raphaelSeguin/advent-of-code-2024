import { readFile } from "fs/promises";
import path from "path";

type Coordinates = Readonly<{
  x: number;
  y: number;
}>;
type Direction = "^" | "v" | "<" | ">";
type Guard = Readonly<{
  direction: Direction;
  position: Coordinates;
}>;
type PatrolMap = Readonly<{
  guard: Guard;
  obstructions: Coordinates[];
  height: number;
  width: number;
}>;

main();

async function main() {
  const input = await readFile(path.join(__dirname, "./input"));
  const patrolMap = parseInput(input.toString());
  const roamPath: Guard[] = roam(patrolMap);
  const positionCount = countPositions(
    roamPath.map(({ position }) => position)
  );
  console.log(positionCount);
}
function countPositions(positions: Coordinates[]) {
  return new Set(positions.map(hashPosition)).size;
}
function parseInput(input: string): PatrolMap {
  const grid = input.split("\n").map((line) => line.split(""));
  const guardFound = gridFindAll(grid, /\^|v|<|>/)?.[0];
  const guard = {
    position: guardFound.coords,
    direction: guardFound.match as Direction,
  };
  const obstructions = gridFindAll(grid, /#/).map(({ coords }) => coords);
  return {
    guard,
    obstructions,
    height: grid.length,
    width: grid[0].length,
  };
}

type GridFindAll = { coords: Coordinates; match: string }[];

function gridFindAll(grid: string[][], re: RegExp): GridFindAll {
  const result: GridFindAll = [];
  grid.forEach((line, y) => {
    line.map((elem, x) => {
      const match = elem.match(re);
      if (match) {
        result.push({ coords: { x, y }, match: match[0] });
      }
    });
  });
  return result;
}

function roam(patrolMap: PatrolMap): Guard[] {
  const result: Guard[] = [];
  let direction = patrolMap.guard.direction;
  let position = patrolMap.guard.position;
  while (true) {
    while (isObstructed({ direction, position }, patrolMap.obstructions)) {
      direction = turnRight(direction);
    }
    position = nextStep({ direction, position });
    if (isInside(position, patrolMap.width, patrolMap.height)) {
      result.push({ direction, position });
    } else {
      return result;
    }
  }
}

function isObstructed(guard: Guard, obstructions: Coordinates[]): boolean {
  return !!obstructions.find(({ x, y }) => {
    const { x: nx, y: ny } = nextStep(guard);
    return x === nx && y === ny;
  });
}

function nextStep(guard: Guard): Coordinates {
  const { position } = guard;
  switch (guard.direction) {
    case "<":
      return { y: position.y, x: position.x - 1 };
    case ">":
      return { y: position.y, x: position.x + 1 };
    case "^":
      return { y: position.y - 1, x: position.x };
    case "v":
      return { y: position.y + 1, x: position.x };
  }
}

function turnRight(direction: Direction): Direction {
  switch (direction) {
    case "^":
      return ">";
    case "v":
      return "<";
    case "<":
      return "^";
    case ">":
      return "v";
  }
}

function isInside(
  position: Coordinates,
  width: number,
  height: number
): boolean {
  const { x, y } = position;
  return x > 0 && y > 0 && x < width && y < height;
}

function hashPosition(position: Coordinates): string {
  return `${position.x.toString().padStart(6, "0")}-${position.y.toString().padStart(6, "0")}`;
}
