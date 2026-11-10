require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
const fs = require("fs");
const path = require("path");
const readline = require("readline");
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Type your Atlas password and press Enter: ", async (password) => {
  rl.close();

  try {
    if (foods.length === 0) {
      console.log("No foods found in assets.js.");
      process.exit(1);
    }

    const uri =
      "mongodb+srv://mailjigisha16_db_user:" +
      encodeURIComponent(password.trim()) +
      "@cluster0.jirlewh.mongodb.net/foodordering?retryWrites=true&w=majority";

    await mongoose.connect(uri);
    await Food.deleteMany({});
    await Food.insertMany(foods);

    console.log(`Done. ${foods.length} foods saved to the ONLINE database.`);
    await mongoose.disconnect();
  } catch (err) {
    if (/auth/i.test(err.message)) {
      console.log("The password is wrong. Make a new password in Atlas and try again.");
    } else {
      console.log("Something went wrong:", err.message);
    }
    process.exit(1);
  }
});

