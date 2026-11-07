require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const email = (process.argv[2] || "").toLowerCase().trim();

(async () => {
  if (!email) {
    console.log("Please write the email after the file name.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });

  if (!user) {
    console.log("No account found with that email. Sign up on the website first.");
  } else {
    console.log(`Done. ${user.email} is now an admin.`);
  }

  await mongoose.disconnect();
})().catch((err) => {
  console.error("Something went wrong:", err.message);
  process.exit(1);
});