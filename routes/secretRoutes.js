const express = require("express");
const router = express.Router();

router.get("/secretWord", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to see the secret word.");
    return res.redirect("/sessions/logon");
  }

  // Set default secret word if not already set
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }

  res.render("secretWord", {
    secretWord: req.session.secretWord,
    error: req.flash("error"),  // optional, already handled globally by storeLocals
    info: req.flash("info"),
  });
});
      
module.exports = router;
