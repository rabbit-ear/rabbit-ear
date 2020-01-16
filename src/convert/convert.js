// to be included in "convert"
import load from "./load";
import fromTo from "./from_to";

const capitalized = s => s.charAt(0).toUpperCase() + s.slice(1);

const permute = function (string) {
  const lower = string.toLowerCase();
  const upper = string.toUpperCase();
  const capital = capitalized(lower);
  const variations = [lower, upper, capital];
  const prefixes = ["", "to", "into"];
  return prefixes.map(pre => variations.map(v => pre + v))
    .reduce((a, b) => a.concat(b), []);
};

const convert = function (...file) {
  // loaded is an object {data: "...", type: "svg"}, only supported extensions
  const loaded = load(...file);
  // console.log("loaded", loaded);
  const c = {};
  ["fold", "svg", "oripa"].forEach(filetype => permute(filetype)
    .forEach(key => Object.defineProperty(c, key, {
      value: (...o) => fromTo(loaded.data, loaded.type, filetype, ...o)
    })));
  return c;
};

export default convert;
