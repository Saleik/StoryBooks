import express from "express";
import passport from "passport";

const router = express.Router();

//@desc Auth with Google
//@route GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//@desc Google Auth Callback
//@route GET / /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.status(200).redirect("/dashboard");
  }
);

//@desc Log Out user
//@route /auth/logout
router.get("/logout", (req,res)=>{
    req.logOut()
    res.redirect('/')
})


export default router;
