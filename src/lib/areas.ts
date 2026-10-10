import { areaAliases, areas, type Area } from "@/content/site";

/** Lower case, no accents, letters and digits only: "Clock-Tower " and "clocktower" match. */
export const normalizeArea = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]/g, "");

const aliasIndex = new Map(Object.entries(areaAliases).map(([alias, area]) => [normalizeArea(alias), area]));

/** The area a common local name stands for ("ghanta ghar" is Clock Tower), if any. */
export const areaForAlias = (query: string) => aliasIndex.get(normalizeArea(query));

/**
 * Areas matching what someone typed, as suggestions: names that start with it first, then
 * names that contain it. A local name counts too, even half typed ("ghanta" suggests Clock
 * Tower). An empty query returns every area.
 */
export function suggestAreas(query: string): readonly Area[] {
  const q = normalizeArea(query);
  if (!q) return areas;
  const viaAlias = new Set([...aliasIndex].filter(([alias]) => alias.startsWith(q)).map(([, area]) => area));
  const starts: Area[] = [];
  const contains: Area[] = [];
  for (const area of areas) {
    const name = normalizeArea(area);
    if (name.startsWith(q) || viaAlias.has(area)) starts.push(area);
    else if (name.includes(q)) contains.push(area);
  }
  return [...starts, ...contains];
}
