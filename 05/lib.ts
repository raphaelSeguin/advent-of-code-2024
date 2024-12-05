
export type Rule = { before: number; after: number };
export type Update = number[];

export function parseInput(input: string): { rules: Rule[]; updates: Update[] } {
  const [rulesString, updatesString] = input.split("\n\n");
  return {
    rules: parseRules(rulesString),
    updates: parseUpdates(updatesString),
  };
}
export function parseRules(input: string): Rule[] {
  return input.split("\n").map((line) => {
    const [before, after] = line.split("|");
    return {
      before: parseInt(before, 10),
      after: parseInt(after, 10),
    };
  });
}
export function parseUpdates(input: string): Update[] {
  return input
    .split("\n")
    .map((line) => line.split(",").map((value) => parseInt(value, 10)));
}
export function isCompliant(update: Update, rule: Rule): boolean {
  for (let i = 1; i < update.length; i += 1) {
    const element = update[i];
    if (element === rule.before && update.slice(0, i).includes(rule.after)) {
      return false;
    }
  }
  return true;
}
export function takeMiddle(update: Update): number {
  return update.at(Math.floor(update.length / 2)) as number
}