
export function rotate90(str: string): string {
  const horizontals = takeHorizontals(str)
    .map((str) => [...str].reverse().join(""))
    .join("\n");
  return takeVerticals(horizontals).join("\n");
}
export function takeHorizontals(str: string) {
  const lines = str.split("\n");
  return lines;
}

export function takeVerticals(str: string): string[] {
  const horizontals = takeHorizontals(str);
  const height = horizontals.length;
  const verticals = [];
  for (let h = 0; h < horizontals[0].length; h += 1) {
    let vertical = "";
    for (let v = 0; v < height; v += 1) {
      vertical += horizontals[v][h];
    }
    verticals.push(vertical);
  }
  return verticals;
}