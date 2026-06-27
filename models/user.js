const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Password Hashing
userSchema.pre("save", function () {
  if (!this.isModified("password")) return;

  const salt = randomBytes(16).toString("hex");

  this.salt = salt;
  this.password = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");
});

// Login
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const userProvidedHash = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (userProvidedHash !== user.password) {
      throw new Error("Incorrect Password");
    }

    return createTokenForUser(user);
  }
);

const User = model("user", userSchema);

module.exports = User;
