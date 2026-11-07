require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Food = require("./models/Food");

// Where your website's food list is saved
const assetsPath = path.join(
  __dirname,
  "..",
  "..",
  "Food Deliver",
  "src",
  "assets",
  "assets.js"
);

const text = fs.readFileSync(assetsPath, "utf8");
const start = text.indexOf("food_list");
const listText = start === -1 ? "" : text.slice(start);

// Every { ... } block in the food list is one food
const blocks = listText.match(/\{[^{}]*\}/g) || [];

const pick = (block, key) => {
  const regex = new RegExp(
    "(?:^|[\\s,{])" +
      key +
      "\\s*:\\s*(?:\"([^\"]*)\"|'([^']*)'|`([^`]*)`|([0-9.]+))"
  );
  const m = block.match(regex);
  if (!m) return undefined;
  return m[1] ?? m[2] ?? m[3] ?? m[4];
};

const foods = blocks
  .map((block) => ({
    name: pick(block, "name"),
    description: pick(block, "description") || "",
    price: Number(pick(block, "price")),
    category: pick(block, "category") || "General",
  }))
  .filter((food) => food.name && !Number.isNaN(food.price));

(async () => {
  if (foods.length === 0) {
    console.log("No foods found in assets.js. Please send me a screenshot of assets.js.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  await Food.deleteMany({});
  await Food.insertMany(foods);

  console.log(`Done. ${foods.length} foods saved to MongoDB.`);
  console.log("First foods:", foods.slice(0, 3).map((f) => f.name).join(", "));

  await mongoose.disconnect();
})().catch((err) => {
  console.error("Something went wrong:", err.message);
  process.exit(1);
});