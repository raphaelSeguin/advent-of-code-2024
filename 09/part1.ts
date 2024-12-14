import { readFile } from "fs/promises";

const inputFile = "example";
// const inputFile = "input";

type FileSpace = {
  type: "file";
  id: number;
};
type FreeSpace = {
  type: "space";
};

type Drive = (FileSpace | FreeSpace)[];

main();

async function main() {
  const input = await readFile(`${__dirname}/${inputFile}`, "utf-8");
  const drive = parseInput(input);
  console.log(`drive`, drive);
  const compacted = compactDisk(drive);
  console.log(`compacted`, compacted);
  const sum = checkSum(compacted);
  console.log(sum);
    console.assert(sum === 1928, "part 1 example");
}

function parseInput(input: string): Drive {
  let id = 0;
  let what: "file" | "space" = "file";
  let output: Drive = [];
  for (const block of input) {
    const size = parseInt(block, 10);
    for (let i = 0; i < size; i++) {
      output.push({
        type: what,
        id,
      });
    }
    if (what === "file") {
      id++;
    }
    what = what === "file" ? "space" : "file";
  }

  return output;
}
function compactDisk(inputDisk: Drive): Drive {
  let result = [];
  let start = 0;
  let end = inputDisk.length - 1;
  while (start <= end) {
    if (inputDisk[start].type === "space") {
      if (inputDisk[end].type === "file") {
        result.push(inputDisk[end]);
        start++;
      }
      end--
    } else {
      result.push(inputDisk[start]);
      start++;
    }
  }
  return result;
}
function checkSum(disk: Drive): number {
  return disk.reduce((sum, block, index) => {
    return sum + (block.type === "file" ? block.id : 0) * index;
  }, 0);
}
