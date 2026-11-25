const passport = require("passport");
const db = require("../models/queries");
const bcrypt = require("bcryptjs");

function getLoginForm(req,res,next) {
    try {
        res.render("log-in");
    } catch (error) {
        next(error)
    }
}

function userLogout(req,res,next) {
    try {
       req.logout((err) => {
            if (err) return next(err);
            res.redirect("/");
        }); 
    } catch (error) {
        next(error)
    }
}

function getSignUpForm(req,res,next) {
    try {
       res.render("sign-up",{ errors: [], formData: {} });
    } catch (error) {
        next(error)
    }
  
}

async function userLogin(req,res,next) {
      passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })(req, res, next);
}

async function getHome(req,res,next) {
    try {
            const messages = await db.getAllMessages();
            res.render("index",{messages,currentUser: req.user || null});
             
    } catch (error) {
            next(error)
    }
}

async function userSignUp(req,res,next) {
    try {
        
        const { firstName = "", lastName = "", username = "", password = "", confirmPassword = "" } = req.body;
        const errors = [];
        const checkExistingUser = await db.findUserByUsername(username.trim());

        if (!firstName.trim()) errors.push("First name is required.");
        if (!lastName.trim()) errors.push("Last name is required.");
        if (!username.trim()) errors.push("Username is required.");
        if (checkExistingUser) errors.push("Username is already taken.");
        if(password !== confirmPassword ){
            if(!password) {errors.push("password is required.")}
            else if(!confirmPassword){ errors.push("Confirm password is required.")}
            else{errors.push("password dont match")}
        }


        if (errors.length>0 ){
            res.render("sign-up", { errors, formData: { firstName, lastName, username,password,confirmPassword } })
            return;
            
        }else{
            if(confirmPassword === password && (password && confirmPassword)){
                const hashedPassword = await bcrypt.hash(password,10);
                await db.createUser({ firstName: firstName.trim(), lastName: lastName.trim(), username: username.trim(), hashedPassword });
                res.redirect("/log-in")
            }else{
                res.render("sign-up", { errors, formData: { password,confirmPassword } })
                return;
            }
        }
  
    } catch (error) {
        next(error)
    } 

}

function getJoinForm(req, res, next){
    try {
        if (!req.user) return res.redirect("/log-in");
        res.render("join", { error: null, currentUser: req.user });
       
    } catch (error) {
        next(error)
    }
    
}

async function joinClub(req, res, next){
    try {
        if(!req.user) return res.redirect("/log-in");
        const result = (req.body.passcode || "").trim() === (process.env.CLUB_PASSCODE || "").trim()
        
        if(result){
            await db.grantMembership(req.user.id);
            res.redirect("/");
        }
        else{
           res.render("join", { error: "Incorrect club passcode.", currentUser: req.user });
        }
    } catch (error) {
        next(error)
    }
}

function getNewMessageForm(req, res){
    if(!req.user){
       return  res.redirect("/log-in")
    }
    res.render("new-message" ,{ errors: [], formData: {}, currentUser: req.user })
}

async function createMessage(req, res, next){
    try {

        if(!req.user){
            return  res.redirect("/log-in")
        }
        
        const { title = "", text = "" } = req.body;
        const errors=[];

        if(! title.trim()) errors.push("Title is empty");
        if(! text.trim()) errors.push("Text is empty");
        if(errors.length >0){
            return  res.render("new-message",{ errors, formData: { title, text }, currentUser: req.user })
        }

        await db.createMessage({ title: title.trim(), text: text.trim(), userId: req.user.id });
        res.redirect("/")
        
    } catch (error) {
        next(error)
    }
}

async function deleteMessage(req, res, next){
    try {

        if(!req.user)return  res.redirect("/log-in")
        if (!req.user.is_admin) return res.status(403).send("Forbidden");
        await db.deleteMessageById(req.params.id);
        res.redirect("/")
        
    } catch (error) {
        next(error)
    }
}

function getAdminForm(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/log-in");
    }
    res.render("admin", { error: null, currentUser: req.user });
  } catch (error) {
    next(error);
  }
}

async function becomeAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/log-in");
    }

    const submittedPasscode = (req.body.passcode || "").trim();
    const expectedPasscode = (process.env.ADMIN_PASSCODE || "").trim();

    if (!expectedPasscode) {
      return res.status(500).send("Admin passcode is not configured.");
    }

    if (submittedPasscode === expectedPasscode) {
      await db.grantAdmin(req.user.id);
      return res.redirect("/");
    }

    res.render("admin", {
      error: "Incorrect admin passcode.",
      currentUser: req.user,
    });
  } catch (error) {
    next(error);
  }
}
module.exports ={
   getHome,
  getSignUpForm,
  userSignUp,
  getLoginForm,
  userLogin,
  userLogout,
  getJoinForm,
  joinClub,
  getAdminForm,
  becomeAdmin,
  getNewMessageForm,
  createMessage,
  deleteMessage,

}