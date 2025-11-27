// seedAdmin.js
const bcrypt = require("bcrypt");
const userModel = require("./model/Auth.model.js");

async function seedAdmin() {
  try {
    const adminExists = await userModel.findOne({ role: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      await userModel.create({
        username: process.env.ADMIN_USERNAME || "admin",
        email: process.env.ADMIN_EMAIL || "yash123",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin user created.");
    } else {
      console.log("ℹ️ Admin user already exists. Skipping seed.");
    }
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  }
}

module.exports = seedAdmin;
