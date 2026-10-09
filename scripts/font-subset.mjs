// Fetches a character subset of Archivo (variable: wdth 62 to 125, wght 100 to 900) from
// the Google Fonts CSS2 API and saves it to src/app/fonts/archivo-subset.woff2.
// The subset keeps printable ASCII plus a few typographic marks, about 62 KB against 91 KB
// for Google's full Latin file. If the copy ever needs another character (an accented
// name, for example), add it to EXTRA and run `npm run assets:font`.
import { writeFileSync } from "node:fs";

const EXTRA = " ©‘’“”…×₹"; // nbsp, copyright, curly quotes, ellipsis, times, rupee
const ascii = Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCharCode(0x20 + i)).join("");
const text = encodeURIComponent(ascii + EXTRA);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const OUT = "src/app/fonts/archivo-subset.woff2";

const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&text=${text}&display=swap`, { headers: { "user-agent": UA } })).text();
const url = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)\s*format\('woff2'\)/)?.[1];
if (!url) throw new Error(`No woff2 URL in the Google Fonts response:\n${css}`);
const font = Buffer.from(await (await fetch(url, { headers: { "user-agent": UA } })).arrayBuffer());
writeFileSync(OUT, font);
console.log(`${OUT}: ${(font.length / 1024).toFixed(1)} KB`);
