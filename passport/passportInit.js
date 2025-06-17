
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

  function passportInit(passport) {
   passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        console.log("Login attempt with:", { email, password }); //  1. Check credentials received

        try {
          const user = await User.findOne({ email });
          if (!user) {
            console.log("No user found for email:", email); //  2. Log user not found
            return done(null, false, { message: "Incorrect credentials." });
          }

          const isMatch = await user.comparePassword(password);
          console.log("Password match:", isMatch); // 3. Log password comparison result

          if (!isMatch) {
            return done(null, false, { message: "Incorrect credentials." });
          }
          console.log("Login successful for user:", user.email); //  4. Successful login
          return done(null, user);
        } catch (err) {
          console.error("Error during login:", err); // 5. Log unexpected error
          return done(err);
        }
      }
    )
   );

  passport.serializeUser ((user, done) => {
    done(null, user.id);
});

  passport.deserializeUser(async(id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

module.exports = passportInit;