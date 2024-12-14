import { readFile } from "fs/promises";

// const inputFile = "example";
const inputFile = "input";

type Block = {
  type: "file" | "space";
  size: number;
  id: number;
};

type Drive = Block[];

main();

async function main() {
  const input = await readFile(`${__dirname}/${inputFile}`, "utf-8");
  const drive = parseInput(input);
  // console.log(`drive`, drive);
  const compacted = compactDisk(drive);
  // console.log(`compacted`, compacted);
  const sum = checkSum(compacted);
  console.log(sum);
  // console.assert(sum === 1928, "part 1 example");
}

function parseInput(input: string): Drive {
  let id = 0;
  let what: "file" | "space" = "file";
  let output: Drive = [];
  for (const block of input) {
    const size = parseInt(block, 10);
    output.push({
      type: what,
      size,
      id: what === "file" ? id : -1,
    });
    if (what === "file") {
      id++;
    }
    what = what === "file" ? "space" : "file";
  }

  return output;
}
function compactDisk(inputDisk: Drive): Drive {
  let disk = copyDisk(inputDisk);
  const findFirstSpaceOfSizeIndex = (drive: Drive, minSize: number): number =>
    drive.findIndex(({ type, size }) => type === "space" && size >= minSize);
  const findFileByIdIndex = (drive: Drive, searchId: number) =>
    drive.findIndex(({ type, id }) => type === "file" && id === searchId);
  let fileId = disk[disk.findLastIndex(({ type }) => type === "file")].id;

  while (fileId > 0) {
    const fileIndex = findFileByIdIndex(disk, fileId);
    const spaceIndex = findFirstSpaceOfSizeIndex(disk, disk[fileIndex].size);
    fileId--;
    if (spaceIndex > fileIndex || spaceIndex === -1) {
      continue;
    }
    // console.log(`swapping file ${fileIndex} and space ${spaceIndex}`)
    disk = mergeSpace(swapBlocks(disk, fileIndex, spaceIndex));
    // console.log(`disk result : ${disk.map(({size, id, type}) => `${(type === "space" ? "." : id)}`.repeat(size)).join("")}`)
  }
  return disk;
}
function checkSum(disk: Drive): number {
  let index = 0;
  return disk.reduce((sum, block) => {
    const blockSum = sumBlock(block, index);
    index += block.size;
    return sum + blockSum;
  }, 0);
}

function sumBlock(block: Block, startIndex: number): number {
  if (block.type === "space") {
    return 0;
  }
  let sum = 0;
  for (let i = 0; i < block.size; i++) {
    sum += (i + startIndex) * block.id;
  }
  return sum;
}

function copyDisk(inputDisk: Drive): Drive {
  const result = [];
  for (let i = 0; i < inputDisk.length; i++) {
    const { type, id, size } = inputDisk[i];
    result.push({
      type,
      id,
      size,
    });
  }
  return result;
}
function copyBlock(block: Block): Block {
  return {
    type: block.type,
    size: block.size,
    id: block.type === "file" ? block.id : -1,
  };
}
function createSpace(size: number): Block {
  return {
    type: "space",
    size,
    id: -1,
  };
}

function swapBlocks(drive: Drive, fileIndex: number, spaceIndex: number): Drive {
  const maxSize = Math.max(drive[fileIndex].size, drive[spaceIndex].size);
  const fileReplace = [copyBlock(drive[fileIndex]), createSpace(maxSize - drive[fileIndex].size)]
  const spaceReplace = [copyBlock(drive[spaceIndex])]
  spaceReplace[0].size = drive[fileIndex].size
  return drive
    .flatMap((block, index) => {
      if (index === fileIndex) {
        return spaceReplace;
      } else if (index === spaceIndex) {
        return fileReplace;
      }
      return block;
    })
}
function mergeSpace(drive: Drive): Drive {
  const result = []
  let index = 0
  while(index < drive.length) {
    if(drive[index].type === "file") {
      result.push(drive[index])
      index += 1
    } else {
      let totalSize = 0
      while(index < drive.length && drive[index].type === "space") {
        totalSize += drive[index].size
        index += 1
      }
      result.push(createSpace(totalSize))
    }
  }
  return result
}