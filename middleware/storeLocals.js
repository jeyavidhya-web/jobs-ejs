const storeLocals = (req, res, next) => {
<<<<<<< HEAD
 res.locals.user = req.user || null;
  res.locals.info = req.flash("info") || [];
  res.locals.error = req.flash("error") || [];
  //  Add this line to pass the previously entered email to the EJS view
  res.locals.email = req.flash("email")[0] || "";
  next();
};
 
  
  
module.exports = storeLocals;


=======
  if (req.user) {
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
  }
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  next();
};

module.exports = storeLocals;
>>>>>>> origin/lesson12
