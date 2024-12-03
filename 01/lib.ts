
export function distanceSum(list1: number[], list2: number[]): number {
 return zip(list1, list2).reduce(
    (sum, [one, two]) => sum + distance(one, two),
    0
  );
}

export function parseInput(input: string): [number[], number[]] {
  const tuples = input.split("\n");
  const list1: number[] = [];
  const list2: number[] = [];
  for (const tuple of tuples) {
    const [one, two] = tuple.split(/\s{3}/);
    list1.push(parseInt(one, 10));
    list2.push(parseInt(two, 10));
  }
  return [list1, list2]
}

export function zip<T>(list1: T[], list2: T[]): [T, T][] {
  return list1.map((el, index) => [el, list2[index]]);
}

export function distance(one: number, two: number): number {
  return Math.abs(one - two);
}