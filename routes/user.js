const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    // Yahan try-catch add kiya hai
    await User.create({
      fullName,
      email,
      password,
    });
    
    return res.redirect("/");
  } catch (error) {
    // Agar error aata hai (jaise duplicate email), toh signup page hi wapis dikhayein
    return res.render("signup", {
      error: "Error: Email already exists or invalid data.",
    });
  }
});

module.exports = router;