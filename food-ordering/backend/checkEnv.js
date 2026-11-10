const fs = require("fs");
const path = require("path");

const text = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
const lines = text.split(/\r?\n/);

lines.forEach((line, i) => {
  const n = i + 1;

  if (line.trim() === "") {
    console.log(`Line ${n}: empty line`);
    return;
  }
  if (line.trim().startsWith("#")) {
    console.log(`Line ${n}: comment (ignored), ${line.length} letters`);
    return;
  }

  const eq = line.indexOf("=");
  if (eq === -1) {
    console.log(`Line ${n}: NO equals sign, ${line.length} letters`);
    return;
  }

  const key = line.slice(0, eq);
  const value = line.slice(eq + 1);

  if (key.trim() === "MONGO_URI") {
    console.log(
      `Line ${n}: MONGO_URI, value length ${value.length}, ` +
        `starts with ${JSON.stringify(value.slice(0, 14))}, ` +
        `has < or >: ${value.includes("<") || value.includes(">")}, ` +
        `@ signs: ${(value.match(/@/g) || []).length}, ` +
        `has space: ${value.includes(" ")}, ` +
        `ends with ${JSON.stringify(value.slice(-9))}`
    );
    return;
  }

  console.log(`Line ${n}: ${key.trim()}, value length ${value.length}`);
});