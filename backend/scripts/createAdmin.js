import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User.js";

async function createInitialAdmin() {
  const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim();
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error("Set BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL, and BOOTSTRAP_ADMIN_PASSWORD in the backend environment before running this command.");
  }
  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error("The bootstrap password must be between 8 and 72 bytes.");
  }
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing from the backend environment.");

  await mongoose.connect(process.env.MONGO_URI);
  if (await User.exists({ role: "ADMIN" })) throw new Error("An Admin account already exists; no account was created.");
  if (await User.exists({ email })) throw new Error("A user with that email already exists; no account was created.");

  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({ name, email, password: hashedPassword, role: "ADMIN", isActive: true });
  console.log(`Initial Admin account created for ${email}. Remove the bootstrap password from the environment.`);
}

createInitialAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState) await mongoose.disconnect();
  });
